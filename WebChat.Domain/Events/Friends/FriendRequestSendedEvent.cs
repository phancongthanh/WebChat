namespace WebChat.Domain.Events.Friends;
public class FriendRequestSendedEvent(Guid currentUserId, Guid friendId, FriendRequest request) : BaseEvent
{
    public Guid CurrentUserId { get; } = currentUserId;
    public Guid FriendId { get; } = friendId;
    public FriendRequest Request { get; } = request;
}
