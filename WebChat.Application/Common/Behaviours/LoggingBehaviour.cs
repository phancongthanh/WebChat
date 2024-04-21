using MediatR.Pipeline;
using Microsoft.Extensions.Logging;

namespace WebChat.Application.Common.Behaviours;
public class LoggingBehaviour<TRequest>(ILogger<TRequest> logger, IUser user, IIdentityService identityService)
    : IRequestPreProcessor<TRequest> where TRequest : notnull
{
    public async Task Process(TRequest request, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = user.Id?.ToString() ?? string.Empty;
        string? userName = string.Empty;

        if (user.Id != null)
        {
            userName = await identityService.GetUserNameAsync(user.GetId());
        }

        logger.LogInformation("WebChat Request: {Name} {@UserId} {@UserName} {@Request}",
            requestName, userId, userName, request);
    }
}
