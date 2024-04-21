using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.EventHandlers;
public class GroupCreatedEventHandler(ILogger<GroupCreatedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<GroupCreatedEvent>
{
    public async Task Handle(GroupCreatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, GroupId: {groupId}, UserIds: {userIds}",
            notification.GetType().Name,
            notification.Group.GroupId,
            string.Join(',', notification.Group.Members.Select(m => m.UserId.ToString())));
        await connector.UpdateGroup(notification.Group.GroupId, cancellationToken);
    }
}
