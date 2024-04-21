namespace WebChat.Domain.Events.Groups;
public class GroupCreatedEvent(Group group) : BaseEvent
{
    public Group Group { get; } = group;
}
