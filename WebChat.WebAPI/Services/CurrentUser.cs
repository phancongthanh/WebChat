using System.Security.Claims;
using WebChat.Application.Common.Interfaces;

namespace WebChat.WebAPI.Services;
public class CurrentUser : IUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userId, out Guid id))
            Id = id;
    }

    public Guid? Id { get; private set; }
}
