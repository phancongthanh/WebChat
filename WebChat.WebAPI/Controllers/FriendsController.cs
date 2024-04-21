using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Interfaces;
using WebChat.Application.Common.Models;
using WebChat.Application.Friendships.Commands.SendFriendRequest;
using WebChat.Application.Friendships.Commands.StartFriendship;
using WebChat.Application.Friendships.Commands.UpdateFriendInfo;
using WebChat.Application.Friendships.Commands.CancelFriendship;
using WebChat.Application.Friendships.Queries.GetFriendsOfUser;
using WebChat.Domain.Entities;

namespace WebChat.WebAPI.Controllers;

public class FriendsController(IUser user) : ApiControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<UserInfo>> GetFriends(CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var query = new GetFriendsOfUserQuery()
        {
            CurrentUserId = userId
        };
        var friends = await Mediator.Send(query, cancellationToken);
        return friends;
    }

    [HttpPost]
    public async Task StartFriendship([FromQuery] Guid friendId, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new StartFriendshipCommand()
        {
            CurrentUserId = userId,
            FriendId = friendId
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpPut]
    public async Task UpdateFriendInfo([FromBody] UpdateFriendInfoCommand command, CancellationToken cancellationToken = default)
    {
        await Mediator.Send(command, cancellationToken);
    }

    [HttpPost("{friendId}/Requests")]
    public async Task SendFriendRequest([FromRoute] Guid friendId, [FromBody] FriendRequest friendRequest, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new SendFriendRequestCommand()
        {
            CurrentUserId = userId,
            FriendId = friendId,
            RequestTitle = friendRequest.Title,
            Description = friendRequest.Description
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpDelete("{friendId}/Requests")]
    public async Task CancelFriendship([FromRoute] Guid friendId, CancellationToken cancellationToken = default)
    {
        var userId = user.GetId();
        var command = new CancelFriendshipCommand()
        {
            CurrentUserId = userId,
            FriendId = friendId
        };
        await Mediator.Send(command, cancellationToken);
    }
}
