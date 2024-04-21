namespace WebChat.Domain.Events.Conversations;

public class MessageStatusUpdatedEvent(Guid conversationId, Guid userId, long messageId, MessageStatus status) : BaseEvent
{
    public Guid ConversationId { get; } = conversationId;
    public Guid UserId { get; } = userId;
    public long MessageId { get; } = messageId;
    public MessageStatus Status { get; } = status;
}
