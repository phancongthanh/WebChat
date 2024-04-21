namespace WebChat.Application.Groups.Commands.UpdateGroupAvatar;

[Authorize]
public record UpdateGroupAvatarCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }

    public Guid CurrentUserId { get; init; }

    public required Stream File { get; init; }
}

public class UpdateGroupAvatarCommandHandler(IGroupRepository repository, IFileStore fileStore)
    : IRequestHandler<UpdateGroupAvatarCommand>
{
    public async Task Handle(UpdateGroupAvatarCommand request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken);
        var member = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId);

        // Domain Validation
        if (member == null)
            throw new ForbiddenAccessException(GroupResource.IsNotMember);
        else if (!member.Role.IsAdmin())
            throw new ForbiddenAccessException(GroupResource.IsNotAdmin);

        // Update data
        var oldPath = group.AvatarPath;
        var path = await fileStore.AddAsync(request.File, cancellationToken);
        group.AvatarPath = path;

        // Save data
        await repository.UpdateAsync(group, cancellationToken);
        if (!string.IsNullOrEmpty(oldPath))
            await fileStore.DeleteAsync(oldPath, cancellationToken);
    }
}
