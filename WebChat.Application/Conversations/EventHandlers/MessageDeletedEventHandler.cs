using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.EventHandlers;
public class MessageDeletedEventHandler(ILogger<MessageDeletedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<MessageDeletedEvent>
{
    public async Task Handle(MessageDeletedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChat Domain Event: {DomainEvent}, ConversationId: {conversationId}, MessageId: {messageId}",
            notification.GetType().Name,
            notification.ConversationId,
            notification.MessageId);
        await connector.DeleteMessage(notification.ConversationId, notification.MessageId, cancellationToken);
    }
}
