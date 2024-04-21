using System.Net;
using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Interfaces;
using WebChat.Application.Common.Models;
using WebChat.Application.Conversations.Commands.DeleteConversation;
using WebChat.Application.Conversations.Commands.DeleteMessage;
using WebChat.Application.Conversations.Commands.HideConversation;
using WebChat.Application.Conversations.Commands.HideMessage;
using WebChat.Application.Conversations.Commands.SendMessage;
using WebChat.Application.Conversations.Queries.GetConversation;
using WebChat.Application.Conversations.Queries.GetConversationsOfUser;
using WebChat.Application.Conversations.Queries.LoadMessages;
using WebChat.Application.Files.Queries.GetFileOfMessage;
using WebChat.Domain.Entities;
using WebChat.Domain.ValueObjects;

namespace WebChat.WebAPI.Controllers;

public class ConversationsController(IUser user) : ApiControllerBase
{
    #region Conversation
    [HttpGet]
    public async Task<IEnumerable<ConversationInfo>> GetConversations(CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var query = new GetConversationsOfUserQuery()
        {
            CurrentUserId = userId
        };
        var conversations = await Mediator.Send(query, cancellationToken);
        return conversations;
    }

    [HttpGet("{conversationId}")]
    public async Task<ConversationInfo> GetConversation([FromRoute] Guid conversationId, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var query = new GetConversationQuery()
        {
            ConversationId = conversationId,
            CurrentUserId = userId
        };
        var conversation = await Mediator.Send(query, cancellationToken);
        return conversation;
    }

    [HttpPatch("{conversationId}/Hidden")]
    public async Task HideConversation([FromRoute] Guid conversationId, [FromQuery] Boolean isHidden, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new HideConversationCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = userId,
            IsHidden = isHidden,
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpDelete("{conversationId}")]
    public async Task DeleteConversation([FromRoute] Guid conversationId, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new DeleteConversationCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = userId
        };
        await Mediator.Send(command, cancellationToken);
    }
    #endregion

    #region Message
    [HttpPost("{conversationId}/Messages")]
    public async Task<long> SendMessage(
    [FromRoute] Guid conversationId,
    [FromForm] string text,
    [FromForm] IEnumerable<IFormFile>? files,
    CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new SendMessageCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = userId,
            Text = text ?? string.Empty,
            Files = files?.Select(file =>
            {
                var info = new FileMetadata(file.Name, file.ContentType, file.Length)
                {
                    Name = file.FileName
                };
                var stream = file.OpenReadStream();
                return (info, stream);
            }) ?? []
        };
        var messageId = await Mediator.Send(command, cancellationToken);
        return messageId;
    }

    [HttpGet("{conversationId}/Messages")]
    public async Task<IEnumerable<Message>> LoadMessagesAsync([FromRoute] Guid conversationId, [FromQuery] long messageId, [FromQuery] int count = 5, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var query = new LoadMessagesQuery()
        {
            ConversationId = conversationId,
            CurrentUserId = userId,
            MessageId = messageId,
            Count = count
        };
        var messages = await Mediator.Send(query, cancellationToken);
        return messages;
    }

    [HttpPatch("{conversationId}/Members/HiddenMessages")]
    public async Task HideMessage([FromRoute] Guid conversationId, [FromQuery] long messageId, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new HideMessageCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = userId,
            MessageId = messageId
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpGet("{conversationId}/Messages/{messageId}/Files/{path}")]
    [ProducesResponseType(typeof(FileStreamResult), (int)HttpStatusCode.OK)]
    [ResponseCache(Duration = 36000, Location = ResponseCacheLocation.Client)]
    public async Task<FileStreamResult> GetFile([FromRoute] Guid conversationId, [FromRoute] long messageId, [FromRoute] string path, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var query = new GetFileOfMessageQuery()
        {
            ConversationId = conversationId,
            CurrentUserId = userId,
            MessageId = messageId,
            FilePath = path
        };
        var file = await Mediator.Send(query, cancellationToken);
        return new FileStreamResult(file.Data, file.Metadata.ContentType) { FileDownloadName = file.Metadata.Name };
    }

    [HttpDelete("{conversationId}/Messages/{messageId}")]
    public async Task DeleteMessage([FromRoute] Guid conversationId, [FromRoute] long messageId, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new DeleteMessageCommand()
        {
            ConversationId = conversationId,
            CurrentUserId = userId,
            MessageId = messageId
        };
        await Mediator.Send(command, cancellationToken);
    } 
    #endregion
}
