namespace WebChat.Application.Common.Interfaces;

public interface IClientConnector
{
    // Friendship
    Task StartFriendship(Guid userId, Guid friendId, CancellationToken cancellationToken = default);
    Task SendFriendRequest(Guid currentUserId, Guid friendId, FriendRequest request, CancellationToken cancellationToken = default);
    Task AcceptFriendRequest(Guid currentUserId, Guid friendId, CancellationToken cancellationToken = default);
    Task UpdateFriend(Guid userId, Guid friendId, CancellationToken cancellationToken = default);
    Task DeleteFriend(Guid userId, Guid friendId, CancellationToken cancellationToken = default);

    // Group
    Task UpdateGroup(Guid groupId, CancellationToken cancellationToken = default);
    Task DeleteGroupMember(GroupMember member, CancellationToken cancellationToken = default);
    Task DeleteGroup(Group group, CancellationToken cancellationToken = default);

    // Conversation
    Task UpdateConversationMember(ConversationMember member, CancellationToken cancellationToken = default);

    Task AddMessage(Message message, CancellationToken cancellationToken = default);

    Task UpdateMessageStatus(Guid conversationId, long messageId, MessageStatus status, CancellationToken cancellationToken = default);

    Task DeleteMessage(Guid conversationId, long messageId, CancellationToken cancellationToken = default);
}
