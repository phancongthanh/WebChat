using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.EventHandlers;
public class MessageSentEventHandler(ILogger<MessageSentEventHandler> logger, IClientConnector connector)
    : INotificationHandler<MessageSentEvent>
{
    public async Task Handle(MessageSentEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, MessageId: {messageId}, UserId: {userId}",
            notification.GetType().Name,
            notification.Message.MessageId,
            notification.Message.FromUserId);
        await connector.AddMessage(notification.Message, cancellationToken);
    }
}
