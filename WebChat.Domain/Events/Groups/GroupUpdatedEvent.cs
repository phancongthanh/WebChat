namespace WebChat.Domain.Events.Groups;
public class GroupUpdatedEvent(Group group) : BaseEvent
{
    public Group Group { get; } = group;
}
