using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.UpdateGroupName;

[Authorize]
public record UpdateGroupNameCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
    public required string GroupName { get; init; }
}

public class UpdateGroupNameCommandHandler(IGroupRepository repository)
        : IRequestHandler<UpdateGroupNameCommand>
{
    public async Task Handle(UpdateGroupNameCommand request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken: cancellationToken);
        var member = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId);

        // Domain validation
        if (member == null)
            throw new ForbiddenAccessException()
                .WithDetail(GroupResource.IsNotMember)
                .WithCode(nameof(GroupResource.IsNotMember));
        else if (!member.Role.IsAdmin() && !group.Setting.AllowChangeGName)
            throw new ForbiddenAccessException()
                .WithDetail(GroupResource.IsNotAdmin)
                .WithCode(nameof(GroupResource.IsNotAdmin));

        // Update data
        group.Name = request.GroupName;
        // Prepare domain event
        var domainEvent = new GroupUpdatedEvent(group);
        group.AddDomainEvent(domainEvent);

        // Save data
        await repository.UpdateAsync(group, cancellationToken);
    }
}
