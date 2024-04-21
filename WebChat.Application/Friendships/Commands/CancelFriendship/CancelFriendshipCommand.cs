namespace WebChat.Application.Friendships.Commands.CancelFriendship;

[Authorize]
public record CancelFriendshipCommand : IRequest, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
    public Guid FriendId { get; init; }
}

public class CancelFriendshipCommandHandler(IFriendRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<CancelFriendshipCommand>
{
    public async Task Handle(CancelFriendshipCommand request, CancellationToken cancellationToken)
    {
        // Domain validation
        var fsOfUser = await repository
            .GetAsync(request.CurrentUserId, request.FriendId, cancellationToken);
        var fsOfFriend = await repository
            .GetAsync(request.FriendId, request.CurrentUserId, cancellationToken);

        // Update data
        fsOfUser.Request = null;
        fsOfFriend.Request = null;
        fsOfUser.IsFriend = false;
        fsOfFriend.IsFriend = false;
        // Preparing domain event
        var domainEvent = new FriendshipCanceledEvent(request.CurrentUserId, request.FriendId);
        fsOfUser.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await repository.UpdateAsync(fsOfUser, cancellationToken);
            await repository.UpdateAsync(fsOfFriend, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}
