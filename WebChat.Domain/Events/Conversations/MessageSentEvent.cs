namespace WebChat.Domain.Events.Conversations;
public class MessageSentEvent(Message message) : BaseEvent
{
    public Message Message { get; } = message;
}
