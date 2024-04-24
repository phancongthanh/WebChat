using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.RejectGroup;

[Authorize]
public record RejectGroupCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
    public Guid UserId { get; init; }
}

public class RejectGroupCommandHandler(IGroupRepository repository) : IRequestHandler<RejectGroupCommand>
{
    public async Task Handle(RejectGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken);
        var joinRequest = group.JoinRequests.SingleOrDefault(r => r.UserId == request.UserId);
        var joinInvitation = group.JoinInvitations.SingleOrDefault(i => i.UserId == request.UserId);
        
        if (request.CurrentUserId == request.UserId)
        {
            // Undo join request or reject join invitation
            if (joinRequest != null) group.JoinRequests.Remove(joinRequest);
            if (joinInvitation != null) group.JoinInvitations.Remove(joinInvitation);
        }
        else
        {
            var member = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId)
                ?? throw new ForbiddenAccessException()
                    .WithDetail(GroupResource.IsNotMember)
                    .WithCode(nameof(GroupResource.IsNotMember));
            
            if (member.Role.IsAdmin())
            {
                // admin reject
                if (joinRequest != null) group.JoinRequests.Remove(joinRequest);
                if (joinInvitation != null) group.JoinInvitations.Remove(joinInvitation);
            }
            else
            {
                // member undo join invitation
                if (joinInvitation != null) group.JoinInvitations.Remove(joinInvitation);
            }
        }

        // Prepare domain event
        var domainEvent = new GroupUpdatedEvent(group);
        group.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateAsync(group, cancellationToken);
    }
}
