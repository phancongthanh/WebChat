using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.EventHandlers;
public class MemberJoinedEventHandler(ILogger<MemberJoinedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<MemberJoinedEvent>
{
    public async Task Handle(MemberJoinedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, GroupId: {groupId}, MemberId: {memberId}",
            notification.GetType().Name,
            notification.Group.GroupId,
            notification.MemberId);
        await connector.UpdateGroup(notification.Group.GroupId, cancellationToken);
    }
}
