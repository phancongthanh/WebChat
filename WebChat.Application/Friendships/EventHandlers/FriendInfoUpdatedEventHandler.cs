using Microsoft.Extensions.Logging;

namespace WebChat.Application.Friendships.EventHandlers;
public class FriendInfoUpdatedEventHandler(ILogger<FriendInfoUpdatedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<FriendInfoUpdatedEvent>
{
    public async Task Handle(FriendInfoUpdatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, CurrentUserId: {userId}, FriendId: {friendId}",
            notification.GetType().Name,
            notification.CurrentUserId,
            notification.FriendId);
        await connector.UpdateFriend(notification.CurrentUserId, notification.FriendId, cancellationToken);
    }
}
