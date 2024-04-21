using Microsoft.Extensions.Logging;

namespace WebChat.Application.Friendships.EventHandlers;

public class FriendRequestAcceptedEventHandler(ILogger<FriendRequestAcceptedEventHandler> logger, IClientConnector connector) 
    : INotificationHandler<FriendRequestAcceptedEvent>
{
    public async Task Handle(FriendRequestAcceptedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, CurrentUserId: {userId}, FriendId: {friendId}",
        notification.GetType().Name,
        notification.CurrentUserId,
            notification.FriendId);
        await connector.AcceptFriendRequest(notification.CurrentUserId, notification.FriendId, cancellationToken);
    }
}
