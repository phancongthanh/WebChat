using Microsoft.Extensions.Logging;

namespace WebChat.Application.Friendships.EventHandlers;

public class FriendshipStartedEventHandler(ILogger<FriendshipStartedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<FriendshipStartedEvent>
{
    public async Task Handle(FriendshipStartedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, UserIds: {userId}, {friendId}",
            notification.GetType().Name,
            notification.CurrentUserId,
            notification.FriendId);
        await connector.StartFriendship(notification.CurrentUserId, notification.FriendId, cancellationToken);
    }
}
