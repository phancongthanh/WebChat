using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using WebChat.Application.Conversations.Commands.ReadMessage;
using WebChat.Application.Conversations.Commands.ReceiveMessage;
using WebChat.Application.Conversations.Commands.SendMessage;

namespace WebChat.WebAPI.Hubs;

[Authorize]
public class ApplicationHub(ISender mediatR) : Hub<IHubClient>
{
    public readonly static IDictionary<string, DateTimeOffset> LastAccessTime
        = new Dictionary<string, DateTimeOffset>();

    public string GetUserId() => Context.User?
        .FindFirst(ClaimTypes.NameIdentifier)?.Value
        ?? throw new UnauthorizedAccessException();
    
    override
    public async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        LastAccessTime[userId] = DateTimeOffset.UtcNow;

        await base.OnConnectedAsync();
    }
    override
    public async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        LastAccessTime[userId] = DateTimeOffset.UtcNow;

        await base.OnDisconnectedAsync(exception);
    }

    public DateTimeOffset? CheckOnline(string userId)
    {
        return LastAccessTime.TryGetValue(userId, out var time) ? time : null;
    }

    public async Task SendTextMessage(Guid conversationId, string text)
    {
        var userId = GetUserId();
        LastAccessTime[userId] = DateTimeOffset.UtcNow;
        var command = new SendMessageCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = Guid.Parse(userId),
            Text = text,
            Files = []
        };
        await mediatR.Send(command);
    }

    public async Task ReceiveMessage(Guid conversationId, long messageId)
    {
        var userId = GetUserId();
        LastAccessTime[userId] = DateTimeOffset.UtcNow;
        var command = new ReceiveMessageCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = Guid.Parse(userId),
            MessageId = messageId
        };
        await mediatR.Send(command);
    }

    public async Task ReadMessage(Guid conversationId, long messageId)
    {
        var userId = GetUserId();
        LastAccessTime[userId] = DateTimeOffset.UtcNow;
        var command = new ReadMessageCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = Guid.Parse(userId),
            MessageId = messageId
        };
        await mediatR.Send(command);
    }
}
