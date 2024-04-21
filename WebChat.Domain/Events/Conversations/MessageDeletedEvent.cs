namespace WebChat.Domain.Events.Conversations;

public class MessageDeletedEvent(Guid conversationId, long messageId) : BaseEvent
{
    public Guid ConversationId { get; } = conversationId;

    public long MessageId { get; } = messageId;
}
