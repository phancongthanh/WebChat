using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Models;
using WebChat.Application.Users.Commands.UpdateUser;
using WebChat.Application.Users.Queries.GetCurrentUser;
using WebChat.Application.Users.Queries.GetUser;
using WebChat.Application.Users.Queries.GetUserByPhone;
using WebChat.Application.Users.Queries.GetUsers;
using WebChat.Domain.Entities;

namespace WebChat.WebAPI.Controllers;

public class UsersController : ApiControllerBase
{
    [HttpGet("Current")]
    public async Task<User> GetCurrentUser(CancellationToken cancellationToken = default)
    {
        var query = new GetCurrentUserQuery();
        var user = await Mediator.Send(query, cancellationToken);
        return user;
    }

    [HttpGet("{userId}")]
    public async Task<UserInfo> GetUser([FromRoute] Guid userId, CancellationToken cancellationToken = default)
    {
        var query = new GetUserQuery() { UserId = userId };
        var user = await Mediator.Send(query, cancellationToken);
        user = Guard.Against.NotFound(userId.ToString(), user);
        return user;
    }

    [HttpGet("PhoneNumber")]
    public async Task<UserInfo?> GetUserByPhone([FromQuery] string country, [FromQuery] string phone, CancellationToken cancellationToken = default)
    {
        var query = new GetUserByPhoneQuery()
        {
            CountryCode = country,
            PhoneNumber = phone
        };
        var user = await Mediator.Send(query, cancellationToken);
        return user;
    }

    [HttpPost]
    public async Task<IEnumerable<UserInfo>> GetUsers([FromBody] Guid[] userIds, CancellationToken cancellationToken = default)
    {
        var query = new GetUsersQuery() { UserIds = userIds };
        var users = await Mediator.Send(query, cancellationToken);
        return users;
    }

    [HttpPut]
    public async Task PutUser([FromBody] UpdateUserCommand command, CancellationToken cancellationToken = default)
    {
        await Mediator.Send(command, cancellationToken);
    }
}
