namespace WebChat.Domain.Entities;

public class Group : AuditableEntity, IAggregateRoot
{
    public Guid GroupId { get; set; } = Guid.Empty;

    public string? AvatarPath { get; set; } = default;

    public string Name { get; set; } = string.Empty;

    public int NumberOfMembers => Members.Count;

    public virtual ICollection<JoinRequest> JoinRequests { get; set; } = new List<JoinRequest>();

    public virtual ICollection<JoinInvitation> JoinInvitations { get; set; } = new List<JoinInvitation>();

    public virtual ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();

    public virtual GroupSetting Setting { get; set; } = new();

    public Guid ConversationId { get; set; } = Guid.Empty;

    public override Guid GetId() => GroupId;
}

public class GroupMember
{
    public Guid GroupId { get; set; } = Guid.Empty;

    public Guid UserId { get; set; } = Guid.Empty;

    public MemberRole Role { get; set; } = MemberRole.Member;

    public DateTime JoinDate { get; set; } = DateTime.UtcNow;

    public string? JoinBy { get; set; }
}

public class JoinRequest
{
    public Guid GroupId { get; set; } = Guid.Empty;

    public Guid UserId { get; set; } = Guid.Empty;

    public DateTime SendTime { get; set; } = DateTime.UtcNow;
}

public class JoinInvitation
{
    public Guid GroupId { get; set; } = Guid.Empty;

    public Guid UserId { get; set; } = Guid.Empty;

    public Guid MemberId { get; set; } = Guid.Empty;

    public DateTime SendTime { get; set; } = DateTime.UtcNow;
}

public class GroupSetting
{
    public bool AllowChangeGName { get; set; } = true;

    public bool AllowSendGInvitation { get; set; } = true;

    public bool MembershipApproval { get; set; } = false;

    public bool ReadRecentMessage { get; set; } = true;

    public bool JoinGroupByLink { get; set; } = true;

    public string GroupCode { get; set; } = string.Empty;
}
