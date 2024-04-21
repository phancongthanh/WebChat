
using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.Commands.DeleteConversation;
public record DeleteConversationCommand : IRequest, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }
}

public class DeleteConversationCommandHandler(IConversationRepository repository) : IRequestHandler<DeleteConversationCommand>
{
    public async Task Handle(DeleteConversationCommand request, CancellationToken cancellationToken)
    {
        var conversation = await repository
           .GetAsync(request.ConversationId, cancellationToken);

        // Domain validation
        var member = conversation.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new ForbiddenAccessException(ConversationResource.IsNotMember);

        // Update data
        member.LoadFromId = conversation.Messages.Max(m => m.MessageId) + 1;

        // Create domain event
        var domainEvent = new ConversationMemberUpdatedEvent(member);
        conversation.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateMember(conversation, member.UserId, cancellationToken);
    }
}
