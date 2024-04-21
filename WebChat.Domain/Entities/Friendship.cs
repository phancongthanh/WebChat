namespace WebChat.Domain.Entities;

public class Friendship : AuditableEntity<(Guid UserId, Guid FriendId)>, IAggregateRoot
{
    public Guid UserId { get; set; } = Guid.Empty;

    public Guid FriendId { get; set; } = Guid.Empty;

    public string? FriendAlias { get; set; } = default;

    public PhoneNumber? FriendPhone { get; set; } = default;

    public bool Blocked { get; set; } = false;
    
    public FriendRequest? Request { get; set; } = default;

    public bool IsFriend { get; set; } = false;

    public Guid ConversationId { get; set; } = Guid.Empty;

    public override (Guid UserId, Guid FriendId) GetId() => new(UserId, FriendId);
}

public class FriendRequest
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime SendTime { get; set; } = DateTime.UtcNow;
}
