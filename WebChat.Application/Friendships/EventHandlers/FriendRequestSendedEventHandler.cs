using Microsoft.Extensions.Logging;

namespace WebChat.Application.Friendships.EventHandlers;

public class FriendRequestSendedEventHandler(ILogger<FriendRequestSendedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<FriendRequestSendedEvent>
{
    public async Task Handle(FriendRequestSendedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, UserId: {userId}, FriendId: {friendId}",
            notification.GetType().Name,
            notification.CurrentUserId,
            notification.FriendId);
        await connector.SendFriendRequest(notification.CurrentUserId, notification.FriendId, notification.Request, cancellationToken);
    }
}
