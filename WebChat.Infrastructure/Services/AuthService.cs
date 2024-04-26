using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebChat.Application.Common.Exceptions;
using WebChat.Domain.Extensions;
using WebChat.Infrastructure.Interfaces;

namespace WebChat.Infrastructure.Services;
internal class AuthService(
    UserManager<ApplicationUser> userManager,
    IOptionsMonitor<JwtBearerOptions> jwtBearerOptions,
    IDistributedCache cache)
    : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly JwtBearerOptions _jwtBearerOptions = jwtBearerOptions.Get(JwtBearerDefaults.AuthenticationScheme);
    private readonly IDistributedCache _cache = cache;
    protected string CreateAccessToken(ApplicationUser user)
    {
        Claim[] claims = [
            new Claim(ClaimTypes.Name, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        ];
        string issuer = _jwtBearerOptions.TokenValidationParameters.ValidIssuer;
        string audience = _jwtBearerOptions.TokenValidationParameters.ValidAudience;
        var key = _jwtBearerOptions.TokenValidationParameters.IssuerSigningKey;
        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var notBefore = DateTime.UtcNow;
        var expires = DateTime.UtcNow.AddHours(1);
        var securityToken = new JwtSecurityToken(issuer, audience, claims, notBefore, expires, signingCredentials);
        return new JwtSecurityTokenHandler().WriteToken(securityToken);
    }
    public async Task<LoginSession> Login(string userName, string password)
    {
        // Check
        var user = await _userManager.Users
            .Where(x => x.UserName == userName)
            .SingleOrDefaultAsync()
            ?? throw new ValidationException()
                .WithDetail(IdentityResource.AccountNotExist)
                .WithCode(nameof(IdentityResource.AccountNotExist));

        var result = await _userManager.CheckPasswordAsync(user, password);
        if (!result)
            throw new ValidationException()
                .WithDetail(IdentityResource.IncorrectPassword)
                .WithCode(nameof(IdentityResource.IncorrectPassword));

        // Create token
        var model = new LoginSession()
        {
            UserId = user.Id,
            RefreshToken = Guid.NewGuid().ToString(),
            AccessToken = CreateAccessToken(user),
            ExpiresTime = DateTimeOffset.UtcNow.AddDays(7)
        };

        // Save and return
        var options = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(model.ExpiresTime);
        await _cache.SetStringAsync(model.RefreshToken, model.AccessToken, options);
        return model;
    }
    public async Task<LoginSession> RefreshToken(string refreshToken, string accessToken)
    {
        // Check
        var oldAccessToken = await _cache.GetStringAsync(refreshToken);
        if (string.IsNullOrEmpty(oldAccessToken) || oldAccessToken != accessToken)
            throw new UnauthorizedAccessException();

        // Create token
        var jwt = new JwtSecurityTokenHandler()
            .ReadJwtToken(accessToken);
        var claim = jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier);
        var userId = Guid.Parse(claim.Value);
        var user = await _userManager.Users.SingleAsync(x => x.Id == userId);
        var model = new LoginSession()
        {
            UserId = user.Id,
            RefreshToken = Guid.NewGuid().ToString(),
            AccessToken = CreateAccessToken(user),
            ExpiresTime = DateTimeOffset.UtcNow.AddMinutes(60)
        };

        // Save and return
        await _cache.RemoveAsync(refreshToken);
        var options = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(model.ExpiresTime);
        await _cache.SetStringAsync(model.RefreshToken, model.AccessToken, options);
        return model;
    }
    
    public async Task Logout(string refreshToken)
    {
        await _cache.RemoveAsync(refreshToken);
    }
}
