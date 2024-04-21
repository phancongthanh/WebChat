namespace WebChat.Application.Common.Security;
public interface ICurrentUser
{
    Guid CurrentUserId { get; }
}
