using Microsoft.Extensions.Logging;

namespace WebChat.Application.Friendships.EventHandlers;
public class FriendshipCanceledEventHandler(ILogger<FriendshipCanceledEventHandler> logger, IClientConnector connector)
    : INotificationHandler<FriendshipCanceledEvent>
{
    public async Task Handle(FriendshipCanceledEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, UserId: {userId}, FriendId: {friendId}",
            notification.GetType().Name,
            notification.CurrentUserId,
            notification.FriendId);
        await connector.DeleteFriend(notification.CurrentUserId, notification.FriendId, cancellationToken);
    }
}
