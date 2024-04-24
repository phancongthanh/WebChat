using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.Commands.DeleteMessage;

[Authorize]
public record DeleteMessageCommand : IRequest, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }

    public long MessageId { get; init; }
}

public class DeleteMessageCommandHandler(IConversationRepository repository) : IRequestHandler<DeleteMessageCommand>
{
    public async Task Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
    {
        var conversation = await repository
           .GetWithoutMessagesAsync(request.ConversationId, cancellationToken);
        var message = await repository.GetMessageAsync(request.MessageId, cancellationToken);
        conversation.Messages.Add(message);

        // Domain validation
        var member = conversation.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new ForbiddenAccessException()
                .WithDetail(ConversationResource.IsNotMember)
                .WithCode(nameof(ConversationResource.IsNotMember));
        if (message.FromUserId != request.CurrentUserId)
            throw new ForbiddenAccessException()
                .WithDetail(MessageResource.IsNotSender)
                .WithCode(nameof(MessageResource.IsNotSender));

        // Create domain event
        var domainEvent = new MessageDeletedEvent(request.ConversationId, request.MessageId);
        conversation.AddDomainEvent(domainEvent);

        // Update data
        message.IsDeleted = true;
        await repository.DeleteMessageAsync(conversation, message.MessageId, cancellationToken);
    }
}
