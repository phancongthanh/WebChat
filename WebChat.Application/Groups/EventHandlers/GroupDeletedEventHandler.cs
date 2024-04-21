using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.EventHandlers;
public class GroupDeletedEventHandler(ILogger<GroupDeletedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<GroupDeletedEvent>
{
    public async Task Handle(GroupDeletedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, Group: {group}",
            notification.GetType().Name,
            notification.Group);
        await connector.DeleteGroup(notification.Group, cancellationToken);
    }
}
