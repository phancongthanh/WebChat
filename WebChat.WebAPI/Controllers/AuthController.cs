using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Interfaces;
using WebChat.Application.Users.Commands.CreateUser;
using WebChat.Domain.ValueObjects;
using WebChat.Infrastructure.Interfaces;
using WebChat.WebAPI.Models;

namespace WebChat.WebAPI.Controllers;

public class AuthController(IIdentityService identityService, IAuthService authService) : ApiControllerBase
{
    [HttpPost("[action]")]
    public async Task SignUp([FromBody] RegisterRequest request)
    {
        var phone = PhoneNumber.From(request.CountryCode, request.PhoneNumber);

        var userId = await identityService.CreateUserAsync(phone.ToString(), request.Password);
        var command = new CreateUserCommand()
        {
            UserId = userId,
            CountryCode = request.CountryCode,
            PhoneNumber = request.PhoneNumber,
            Name = request.Name,
            Birthday = request.Birthday,
            Gender = request.Gender,
        };
        await Mediator.Send(command);
    }

    [HttpPost("[action]")]
    public async Task<LoginResponse> Login([FromBody] LoginRequest request)
    {
        var phone = PhoneNumber.From(request.Country, request.Phone);
        var session = await authService.Login(phone.ToString(), request.Password);
        var response = new LoginResponse()
        {
            UserId = session.UserId,
            RefreshToken = session.RefreshToken,
            AccessToken = session.AccessToken,
            ExpiresTime = session.ExpiresTime
        };
        return response;
    }

    [HttpGet("[action]")]
    public async Task<LoginResponse> AccessToken([FromQuery] string refreshToken, [FromQuery] string accessToken)
    {
        var session = await authService.RefreshToken(refreshToken, accessToken);
        var response = new LoginResponse()
        {
            UserId = session.UserId,
            RefreshToken = session.RefreshToken,
            AccessToken = session.AccessToken,
            ExpiresTime = session.ExpiresTime
        };
        return response;
    }

    [HttpPut("[action]")]
    public async Task ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var phone = PhoneNumber.From(request.Country, request.Phone);
        await identityService.ChangePassword(phone.ToString(), request.OldPassword, request.NewPassword);
    }

    [HttpDelete("[action]")]
    public async Task LogOut([FromQuery] string refreshToken)
    {
        await authService.Logout(refreshToken);
    }
}
