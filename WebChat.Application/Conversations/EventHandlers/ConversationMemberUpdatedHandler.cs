using Microsoft.Extensions.Logging;
using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Conversations.EventHandlers;
public class ConversationMemberUpdatedHandler(ILogger<ConversationMemberUpdatedHandler> logger, IClientConnector connector)
    : INotificationHandler<ConversationMemberUpdatedEvent>
{
    public async Task Handle(ConversationMemberUpdatedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("WebChatServer Domain Event: {DomainEvent}, Member: {member}",
            notification.GetType().Name,
            notification.Member);
        await connector.UpdateConversationMember(notification.Member, cancellationToken);
    }
}
