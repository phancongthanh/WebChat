using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Interfaces;
using WebChat.Application.Groups.Commands.UpdateGroupAvatar;
using WebChat.Application.Groups.Queries.GetGroupAvatar;
using WebChat.Application.Users.Commands.UpdateUserAvatar;
using WebChat.Application.Users.Queries.GetUserAvatar;
using WebChat.Infrastructure.Constants;
using WebChat.Infrastructure.Interfaces;

namespace WebChat.WebAPI.Controllers;

public class AvatarsController(IUser currentUser, IImageProcessor processor) : ApiControllerBase
{
    [HttpGet("User/{userId}")]
    [ProducesResponseType(typeof(FileStreamResult), (int)HttpStatusCode.OK)]
    [Produces(ImageFormat.DefaultMimeType)]
    public async Task<FileStreamResult> GetUser([FromRoute] Guid userId, CancellationToken cancellationToken = default)
    {
        var file = await Mediator.Send(new GetUserAvatarQuery() { UserId = userId }, cancellationToken);
        return new FileStreamResult(file, ImageFormat.DefaultMimeType);
    }

    [HttpGet("Group/{groupId}")]
    [ProducesResponseType(typeof(FileStreamResult), (int)HttpStatusCode.OK)]
    [Produces(ImageFormat.DefaultMimeType)]
    public async Task<FileStreamResult> GetGroup([FromRoute] Guid groupId, CancellationToken cancellationToken = default)
    {
        var file = await Mediator.Send(new GetGroupAvatarQuery() { GroupId = groupId }, cancellationToken);
        return new FileStreamResult(file, ImageFormat.DefaultMimeType);
    }

    [Authorize]
    [HttpPut("User")]
    public async Task SetUser(IFormFile avatar, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.GetId();
        using var stream = avatar.OpenReadStream();
        using var image = await processor.NormalizeAsync(stream, cancellationToken);
        await Mediator.Send(new UpdateUserAvatarCommand()
        {
            CurrentUserId = userId,
            File = image
        }, cancellationToken);
    }

    [Authorize]
    [HttpPut("Group/{groupId}")]
    public async Task SetGroup([FromRoute] Guid groupId, IFormFile avatar, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.GetId();
        using var stream = avatar.OpenReadStream();
        using var image = await processor.NormalizeAsync(stream, cancellationToken);
        await Mediator.Send(new UpdateGroupAvatarCommand()
        {
            GroupId = groupId,
            CurrentUserId = userId,
            File = image
        }, cancellationToken);
    }
}
