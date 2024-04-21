using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.EventHandlers;
public class GroupUpdatedEventHandler(ILogger<GroupUpdatedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<GroupUpdatedEvent>
{
    public async Task Handle(GroupUpdatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, GroupId: {groupId}",
            notification.GetType().Name,
            notification.Group.GroupId);
        await connector.UpdateGroup(notification.Group.GroupId, cancellationToken);
    }
}
