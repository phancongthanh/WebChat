namespace WebChat.Application.Users.Commands.UpdateUserAvatar;

[Authorize]
public record UpdateUserAvatarCommand : IRequest, ICurrentUser
{
    public Guid CurrentUserId { get; init; }

    public required Stream File { get; init; }
}

public class UpdateUserAvatarCommandHandler(
    IUnitOfWork unitOfWork,
    IUserRepository repository,
    IFileStore fileStore)
    : IRequestHandler<UpdateUserAvatarCommand>
{
    public async Task Handle(UpdateUserAvatarCommand request, CancellationToken cancellationToken)
    {
        var user = await repository.GetAsync(request.CurrentUserId, cancellationToken);

        // Update data
        var oldPath = user.AvatarPath;
        var path = await fileStore.AddAsync(request.File, cancellationToken);
        user.AvatarPath = path;

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await repository.UpdateAsync(user, cancellationToken);
            if (!string.IsNullOrEmpty(oldPath))
                await fileStore.DeleteAsync(oldPath, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}
