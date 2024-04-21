namespace WebChat.Infrastructure.Interfaces;
public interface IAuthService
{
    Task<LoginSession> Login(string userName, string password);
    Task<LoginSession> RefreshToken(string refreshToken, string accessToken);
    Task Logout(string refreshToken);
}
