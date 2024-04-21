namespace WebChat.Domain.Events.Conversations;

public class ConversationMemberUpdatedEvent(ConversationMember member) : BaseEvent
{
    public ConversationMember Member { get; } = member;
}
