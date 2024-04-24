using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.Commands.ReceiveMessage;

[Authorize]
public record ReceiveMessageCommand : IRequest, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }

    public long MessageId { get; init; }
}

public class ReceiveMessageCommandHandler(IConversationRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<ReceiveMessageCommand>
{
    public async Task Handle(ReceiveMessageCommand request, CancellationToken cancellationToken)
    {
        var conversation = await repository
            .GetWithoutMessagesAsync(request.ConversationId, cancellationToken);
        var message = await repository.GetMessageAsync(request.MessageId, cancellationToken);

        // Domain validation
        var member = conversation.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new ForbiddenAccessException()
                .WithDetail(ConversationResource.IsNotMember)
                .WithCode(nameof(ConversationResource.IsNotMember));

        // Update data
        if (member.ReceivedToId < request.MessageId) member.ReceivedToId = request.MessageId;
        // Create domain event
        conversation.AddDomainEvent(new ConversationMemberUpdatedEvent(member));

        // Save only member
        if (message.Status >= MessageStatus.Received || message.FromUserId == request.CurrentUserId)
        {
            await repository.UpdateMember(conversation, member.UserId, cancellationToken);
            return;
        }

        // Update message status
        message.Status = MessageStatus.Received;
        // Create domain event
        var domainEvent = new MessageStatusUpdatedEvent(request.ConversationId, request.CurrentUserId, request.MessageId, MessageStatus.Received);
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
