using Microsoft.Extensions.Logging;
using WebChat.Domain.Constants;
using WebChat.Domain.Exceptions;
using ValidationException = WebChat.Application.Common.Exceptions.ValidationException;

namespace WebChat.Application.Common.Behaviours;
public class UnhandledExceptionBehaviour<TRequest, TResponse>(ILogger<TRequest> logger)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        try
        {
            return await next();
        }
        catch (Exception ex)
        {
            var requestName = typeof(TRequest).Name;

            if (ex.Data.Contains(ErrorConstants.Detail))
                logger.LogWarning(ex, "WebChat Request: Unhandled Exception for Request {Name} {@Request}", requestName, request);
            else
                logger.LogError(ex, "WebChat Request: Unhandled Exception for Request {Name} {@Request}", requestName, request);

            if (ex is InvalidPhoneNumberException)
            {
                throw new ValidationException()
                    .WithDetail(PhoneNumberResource.Invalid)
                    .WithCode(nameof(PhoneNumberResource.Invalid));
            }

            throw;
        }
    }
}
