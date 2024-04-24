namespace WebChat.Application.Users.Queries.GetUserAvatar;
public record GetUserAvatarQuery : IRequest<Stream>
{
    public Guid UserId { get; init; }
}

public class GetUserAvatarQueryHandler(IUserRepository repository, IFileStore fileStore)
    : IRequestHandler<GetUserAvatarQuery, Stream>
{
    private readonly IUserRepository _repository = repository;
    private readonly IFileStore _fileStore = fileStore;

    public async Task<Stream> Handle(GetUserAvatarQuery request, CancellationToken cancellationToken)
    {
        // Preparing data
        var user = await _repository.GetAsync(request.UserId, cancellationToken);

        var path = Guard.Against.NotFound(request.UserId, user.AvatarPath, UserResource.AvatarPath);

        var file = await _fileStore.GetAsync(path, cancellationToken);

        return file ?? throw new NotFoundException(path, nameof(UserResource.AvatarPath))
            .WithDetail(UserResource.NotFoundAvatar)
            .WithCode(nameof(UserResource.NotFoundAvatar));
    }
}
