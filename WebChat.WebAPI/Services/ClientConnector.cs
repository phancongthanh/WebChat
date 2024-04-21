using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using WebChat.Application.Common.Interfaces;
using WebChat.Domain.Entities;
using WebChat.Domain.Enums;
using WebChat.Domain.Interfaces.Repositories;
using WebChat.WebAPI.Hubs;

namespace WebChat.WebAPI.Services;

public class ClientConnector(IHubContext<ApplicationHub, IHubClient> hubContext, IUser user, IConversationRepository conversationRepository, IGroupRepository groupRepository)
    : IClientConnector
{
    // Friendship
    public async Task StartFriendship(Guid userId, Guid friendId, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients
            .User(userId.ToString())
            .UpdateFriend(friendId);
        await hubContext.Clients
            .User(friendId.ToString())
            .UpdateFriend(userId);
    }
    public async Task SendFriendRequest(Guid currentUserId, Guid friendId, FriendRequest request, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients
            .User(currentUserId.ToString())
            .UpdateFriend(friendId);
        await hubContext
            .Clients.User(friendId.ToString())
            .SendFriendRequest(currentUserId, request);
    }
    public async Task AcceptFriendRequest(Guid currentUserId, Guid friendId, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients
            .User(currentUserId.ToString())
            .UpdateFriend(friendId);
        await hubContext.Clients
            .User(friendId.ToString())
            .AcceptFriendRequest(currentUserId);
    }
    public async Task UpdateFriend(Guid userId, Guid friendId, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients
            .User(userId.ToString())
            .UpdateFriend(friendId);
        await hubContext.Clients
            .User(friendId.ToString())
            .UpdateFriend(userId);
    }
    public async Task DeleteFriend(Guid userId, Guid friendId, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients
            .User(userId.ToString())
            .UpdateFriend(friendId);
        await hubContext.Clients
            .User(friendId.ToString())
            .UpdateFriend(userId);
    }

    // Group
    public async Task UpdateGroup(Guid groupId, CancellationToken cancellationToken = default)
    {
        try
        {
            var group = await groupRepository.GetAsync(groupId, cancellationToken);
            var memberIds = group.Members.Select(m => m.UserId.ToString());
            await hubContext.Clients.Users(memberIds).UpdateGroup(groupId);
            var currentUserId = user.GetId().ToString();
            if (!memberIds.Contains(currentUserId))
                await hubContext.Clients.User(currentUserId).UpdateGroup(groupId);
        }
        catch (Exception) { }
    }
    public async Task DeleteGroupMember(GroupMember member, CancellationToken cancellationToken = default)
    {
        var group = await groupRepository.GetAsync(member.GroupId, cancellationToken);
        var memberIds = group.Members.Select(m => m.UserId.ToString());
        await hubContext.Clients.Users(memberIds).UpdateGroup(group.GroupId);
        await hubContext.Clients.User(member.UserId.ToString()).UpdateGroup(group.GroupId);
    }
    public async Task DeleteGroup(Domain.Entities.Group group, CancellationToken cancellationToken = default)
    {
        var memberIds = group.Members.Select(m => m.UserId.ToString());
        await hubContext.Clients.Users(memberIds).DeleteGroup(group.GroupId);
        memberIds = group.JoinRequests.Select(m => m.UserId.ToString());
        await hubContext.Clients.Users(memberIds).DeleteGroup(group.GroupId);
        memberIds = group.JoinInvitations.Select(m => m.UserId.ToString());
        await hubContext.Clients.Users(memberIds).DeleteGroup(group.GroupId);
    }

    // Conversation
    public async Task UpdateConversationMember(ConversationMember member, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients
           .User(member.UserId.ToString())
           .UpdateConversationMember(member);
    }

    public async Task AddMessage(Message message, CancellationToken cancellationToken = default)
    {
        var conversation = await conversationRepository.GetWithoutMessagesAsync(message.ConversationId, cancellationToken);
        var memberIds = conversation.Members.Select(m => m.UserId.ToString());
        await hubContext.Clients.Users(memberIds).AddMessage(message);
    }

    public async Task UpdateMessageStatus(Guid conversationId, long messageId, MessageStatus status, CancellationToken cancellationToken = default)
    {
        var conversation = await conversationRepository.GetWithoutMessagesAsync(conversationId, cancellationToken);
        var memberIds = conversation.Members.Select(m => m.UserId.ToString());
        await hubContext.Clients.Users(memberIds).UpdateMessageStatus(conversationId, messageId, status);
    }

    public async Task DeleteMessage(Guid conversationId, long messageId, CancellationToken cancellationToken = default)
    {
        var conversation = await conversationRepository.GetWithoutMessagesAsync(conversationId, cancellationToken);
        var memberIds = conversation.Members.Select(m => m.UserId.ToString());
        await hubContext.Clients.Users(memberIds).DeleteMessage(conversationId, messageId);
    }
}
