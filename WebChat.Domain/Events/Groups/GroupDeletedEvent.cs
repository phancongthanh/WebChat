namespace WebChat.Domain.Events.Groups;
public class GroupDeletedEvent(Group group) : BaseEvent
{
    public Group Group { get; } = group;
}
