namespace WebChat.Application.Groups.Queries.GetGroupAvatar;
public record GetGroupAvatarQuery : IRequest<Stream>
{
    public Guid GroupId { get; init; }
}

public class GetGroupAvatarQueryHandler(IGroupRepository repository, IFileStore fileStore)
    : IRequestHandler<GetGroupAvatarQuery, Stream>
{
    public async Task<Stream> Handle(GetGroupAvatarQuery request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken);

        var path = Guard.Against.NotFound(request.GroupId, group.AvatarPath, GroupResource.AvatarPath);

        var file = await fileStore.GetAsync(path, cancellationToken);

        return file ?? throw new NotFoundException(path, nameof(GroupResource.AvatarPath))
            .WithDetail(GroupResource.NotFoundAvatar)
            .WithCode(nameof(GroupResource.NotFoundAvatar));
    }
}
