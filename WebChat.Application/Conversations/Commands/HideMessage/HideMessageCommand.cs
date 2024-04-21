using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.Commands.HideMessage;

[Authorize]
public record HideMessageCommand : IRequest, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }

    public long MessageId { get; init; }
}

public class HideMessageCommandHandler(IConversationRepository repository) : IRequestHandler<HideMessageCommand>
{
    public async Task Handle(HideMessageCommand request, CancellationToken cancellationToken)
    {
        var conversation = await repository
            .GetWithoutMessagesAsync(request.ConversationId, cancellationToken);
        // Domain validation
        var member = conversation.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new ForbiddenAccessException(ConversationResource.IsNotMember);

        // Update data
        member.HiddenMessageIds.Add(request.MessageId);

        // Create domain event
        var domainEvent = new ConversationMemberUpdatedEvent(member);
        conversation.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateMember(conversation, member.UserId, cancellationToken);
    }
}
