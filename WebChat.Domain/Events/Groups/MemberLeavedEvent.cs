namespace WebChat.Domain.Events.Groups;
public class MemberLeavedEvent(Group group, GroupMember member) : BaseEvent
{
    public Group Group { get; } = group;
    public GroupMember Member { get; } = member;
}
