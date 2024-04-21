namespace WebChat.Domain.Events.Friends;

public class FriendInfoUpdatedEvent(Friendship friendship) : BaseEvent
{
    public Guid CurrentUserId { get; } = friendship.UserId;
    public Guid FriendId { get; } = friendship.FriendId;
    public string? FriendAlias { get; } = friendship.FriendAlias;
    public bool Blocked { get; } = friendship.Blocked;
}
