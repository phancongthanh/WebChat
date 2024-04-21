using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.UpdateGroupSetting;

[Authorize]
public record UpdateGroupSettingCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
    public required GroupSetting Setting { get; init; }
}

public class UpdateGroupSettingCommandHandler(IGroupRepository repository)
    : IRequestHandler<UpdateGroupSettingCommand>
{
    public async Task Handle(UpdateGroupSettingCommand request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken: cancellationToken);
        var member = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId);

        // Domain validation
        if (member == null)
            throw new ForbiddenAccessException(GroupResource.IsNotMember);
        else if (!member.Role.IsAdmin())
            throw new ForbiddenAccessException(GroupResource.IsNotAdmin);

        // Update data
        group.Setting = request.Setting;

        // Prepare domain event
        var domainEvent = new GroupUpdatedEvent(group);
        group.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateAsync(group, cancellationToken);
    }
}
