using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.Commands.HideConversation;
public record HideConversationCommand : IRequest, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }

    public bool IsHidden { get; init; }
}

public class HideConversationCommandHandler(IConversationRepository repository) : IRequestHandler<HideConversationCommand>
{
    public async Task Handle(HideConversationCommand request, CancellationToken cancellationToken)
    {
        var conversation = await repository
           .GetWithoutMessagesAsync(request.ConversationId, cancellationToken);

        // Domain validation
        var member = conversation.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new ForbiddenAccessException()
                .WithDetail(ConversationResource.IsNotMember)
                .WithCode(nameof(ConversationResource.IsNotMember));

        // Update data
        member.IsHidden = request.IsHidden;

        // Create domain event
        var domainEvent = new ConversationMemberUpdatedEvent(member);
        conversation.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateMember(conversation, member.UserId, cancellationToken);
    }
}
