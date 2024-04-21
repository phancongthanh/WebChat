using WebChat.Domain.Entities;
using WebChat.Domain.Enums;

namespace WebChat.WebAPI.Hubs;

public interface IHubClient
{
    // Friend
    Task SendFriendRequest(Guid friendId, FriendRequest request);
    Task AcceptFriendRequest(Guid friendId);
    Task UpdateFriend(Guid friendId);

    // Group
    Task UpdateGroup(Guid groupId);

    Task DeleteGroup(Guid groupId);


    // Conversation
    Task UpdateConversationMember(ConversationMember member);

    Task AddMessage(Message message);

    Task UpdateMessageStatus(Guid conversationId, long messageId, MessageStatus status);

    Task DeleteMessage(Guid conversationId, long messageId);
}
