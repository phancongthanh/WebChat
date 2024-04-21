namespace WebChat.Domain.Events.Groups;
public class MemberJoinedEvent(Group group, Guid memberId) : BaseEvent
{
    public Group Group { get; } = group;

    public Guid MemberId { get; } = memberId;

    public GroupMember Member => Group.Members.Single(m => m.UserId == MemberId);
}
