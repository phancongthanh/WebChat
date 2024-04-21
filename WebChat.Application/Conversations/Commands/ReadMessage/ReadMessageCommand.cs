using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.Commands.ReadMessage;

[Authorize]
public record ReadMessageCommand : IRequest, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }

    public long MessageId { get; init; }
}

public class ReadMessageCommandHandler(IConversationRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<ReadMessageCommand>
{
    public async Task Handle(ReadMessageCommand request, CancellationToken cancellationToken)
    {
        var conversation = await repository
            .GetWithoutMessagesAsync(request.ConversationId, cancellationToken);
        var message = await repository.GetMessageAsync(request.MessageId, cancellationToken);
        conversation.Messages.Add(message);

        // Domain validation
        if (conversation.ConversationId != message.ConversationId)
            throw new ForbiddenAccessException(ConversationResource.IsNotMember);
        var member = conversation.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new ForbiddenAccessException(ConversationResource.IsNotMember);

        // Update data
        if (member.SeenToId < request.MessageId) member.SeenToId = request.MessageId;
        if (member.ReceivedToId < request.MessageId) member.ReceivedToId = request.MessageId;
        // Create domain event
        conversation.AddDomainEvent(new ConversationMemberUpdatedEvent(member));

        // Save only member
        if (message.Status >= MessageStatus.Seen || message.FromUserId == request.CurrentUserId)
        {
            await repository.UpdateMember(conversation, member.UserId, cancellationToken);
            return;
        }

        // Update message status
        message.Status = MessageStatus.Seen;
        // Create domain event
        var domainEvent = new MessageStatusUpdatedEvent(request.ConversationId, request.CurrentUserId, request.MessageId, MessageStatus.Seen);
        conversation.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await repository.UpdateMember(conversation, member.UserId, cancellationToken);
            await repository.UpdateMessageStatusAsync(conversation, message.MessageId, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}
