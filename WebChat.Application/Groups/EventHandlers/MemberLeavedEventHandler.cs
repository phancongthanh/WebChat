using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.EventHandlers;
public class MemberLeavedEventHandler(ILogger<MemberLeavedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<MemberLeavedEvent>
{
    public async Task Handle(MemberLeavedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, GroupId: {groupId}, MemberId: {memberId}",
            notification.GetType().Name,
            notification.Group.GroupId,
            notification.Member.UserId);
        await connector.DeleteGroupMember(notification.Member, cancellationToken);
    }
}
