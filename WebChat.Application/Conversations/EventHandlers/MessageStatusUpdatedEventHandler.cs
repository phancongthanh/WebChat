using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.EventHandlers;

public class MessageStatusUpdatedEventHandler(ILogger<MessageStatusUpdatedEventHandler> logger, IClientConnector connector)
    : INotificationHandler<MessageStatusUpdatedEvent>
{
    public async Task Handle(MessageStatusUpdatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChatServer Domain Event: {DomainEvent}, MessageId: {messageId}, UserId: {userId}, Status: {status}",
            notification.GetType().Name,
            notification.MessageId,
            notification.UserId,
            notification.Status);
        await connector.UpdateMessageStatus(notification.ConversationId, notification.MessageId, notification.Status, cancellationToken);
    }
}
