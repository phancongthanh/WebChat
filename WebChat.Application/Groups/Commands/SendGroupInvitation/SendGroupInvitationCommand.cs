using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.SendGroupInvitation;

[Authorize]
public record SendGroupInvitationCommand : IRequest, ICurrentUser
{
    public required Guid GroupId { get; init; }
    public required Guid CurrentUserId { get; init; }
    public required IEnumerable<Guid> UserIds { get; init; }
}

public class SendGroupInvitationCommandHandler(IGroupRepository repository) : IRequestHandler<SendGroupInvitationCommand>
{
    public async Task Handle(SendGroupInvitationCommand request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken);
        var member = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId);

        // Domain validation
        if (member == null)
            throw new ForbiddenAccessException("Current user is not member of group.")
                .WithDetail(GroupResource.IsNotMember)
                .WithCode(GroupResource.IsNotMember);
        if (!member.Role.IsAdmin() && !group.Setting.AllowSendGInvitation)
            throw new ForbiddenAccessException("Group settings do not allow member to send invitation.")
                .WithDetail(GroupResource.NotAllowSendInvitation)
                .WithCode(nameof(GroupResource.NotAllowSendInvitation));

        // Update data
        foreach (var userId in request.UserIds)
        {
            if (group.Members.Any(m => m.UserId == userId)) continue;
            if (group.JoinRequests.Any(m => m.UserId == userId)) continue;
            if (group.JoinInvitations.Any(m => m.UserId == userId)) continue;
            var invitation = new JoinInvitation()
            {
                GroupId = request.GroupId,
                MemberId = request.CurrentUserId,
                UserId = userId,
                SendTime = DateTime.UtcNow,
            };
            group.JoinInvitations.Add(invitation);
        }

        // Prepare domain event
        var domainEvent = new GroupUpdatedEvent(group);
        group.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateAsync(group, cancellationToken);
    }
}
