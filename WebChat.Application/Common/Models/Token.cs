namespace WebChat.Application.Common.Models;

public class Token
{
    public Guid TokenId { get; set; } = Guid.Empty;

    public Guid UserId { get; set; } = Guid.Empty;

    public bool IsLocked { get; set; } = false;

    public string RefreshToken { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;

    public DateTimeOffset CreatedTime { get; set; }

    public DateTimeOffset ExpiresTime { get; set; }

    public string? HubId { get; set; } = default;
    public DateTimeOffset? LastAccessTime { get; set; } = default;
}
