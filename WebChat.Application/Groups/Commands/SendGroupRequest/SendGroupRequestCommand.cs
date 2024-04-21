
using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.SendGroupRequest;
[Authorize]
public record SendGroupRequestCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
}

public class SendGroupRequestCommandHandler(IGroupRepository repository) : IRequestHandler<SendGroupRequestCommand>
{
    public async Task Handle(SendGroupRequestCommand request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken);
        if (group.JoinRequests.Any(r => r.UserId == request.CurrentUserId) || group.Members.Any(m => m.UserId == request.CurrentUserId))
            return;

        // Update data
        var joinRequest = new JoinRequest()
        {
            GroupId = group.GroupId,
            UserId = request.CurrentUserId,
            SendTime = DateTime.Now,
        };
        group.JoinRequests.Add(joinRequest);

        // Prepare domain event
        var domainEvent = new GroupUpdatedEvent(group);
        group.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateAsync(group, cancellationToken);
    }
}
