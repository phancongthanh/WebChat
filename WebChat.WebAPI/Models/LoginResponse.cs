namespace WebChat.WebAPI.Models;

public class LoginResponse
{
    public Guid UserId { get; set; } = Guid.Empty;

    public string RefreshToken { get; set; } = string.Empty;

    public string AccessToken { get; set; } = string.Empty;

    public DateTimeOffset ExpiresTime { get; set; }
}
