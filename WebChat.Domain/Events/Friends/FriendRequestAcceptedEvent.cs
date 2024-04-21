namespace WebChat.Domain.Events.Friends;

public class FriendRequestAcceptedEvent(Guid currentUserId, Guid friendId) : BaseEvent
{
    public Guid CurrentUserId { get; } = currentUserId;
    public Guid FriendId { get; } = friendId;
}
