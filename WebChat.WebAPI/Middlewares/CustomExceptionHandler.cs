using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Exceptions;
using WebChat.Infrastructure.Exceptions;
using WebChat.WebAPI.Resources;

namespace WebChat.WebAPI.Middlewares;
public class CustomExceptionHandler : IExceptionHandler
{
    private readonly Dictionary<Type, Func<HttpContext, Exception, Task<bool>>> _exceptionHandlers;
    private readonly IProblemDetailsService _problemDetailsService;

    public CustomExceptionHandler(IProblemDetailsService problemDetailsService)
    {
        // Register known exception types and handlers.
        _exceptionHandlers = new()
            {
                { typeof(ValidationException), HandleValidationException },
                { typeof(UnauthorizedAccessException), HandleUnauthorizedAccessException },
                { typeof(ForbiddenAccessException), HandleForbiddenAccessException },
                { typeof(NotFoundException), HandleNotFoundException },
                { typeof(InvalidFileFormatException), HandleInvalidFileFormatException },
                { typeof(ConflictException), HandleConflictException },
            };
        _problemDetailsService = problemDetailsService;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var exceptionType = exception.GetType();

        return _exceptionHandlers.TryGetValue(exceptionType, out var value)
            && await value.Invoke(httpContext, exception);
    }

    private async Task<bool> HandleValidationException(HttpContext httpContext, Exception ex)
    {
        var exception = (ValidationException)ex;

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
        {
            HttpContext = httpContext,
            ProblemDetails = new ValidationProblemDetails(exception.Errors)
            {
                Title = ErrorResource.E400Title,
                Detail = ErrorResource.E400Detail
            },
            Exception = ex
        });
    }

    private async Task<bool> HandleUnauthorizedAccessException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
        {
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails
            {
                Title = ErrorResource.E401Title,
                Detail = ErrorResource.E401Detail
            },
            Exception = ex
        });
    }

    private async Task<bool> HandleForbiddenAccessException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
        {
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails
            {
                Title = ErrorResource.E403Title,
                Detail = ErrorResource.E403Detail
            },
            Exception = ex
        });
    }

    private async Task<bool> HandleNotFoundException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.StatusCode = StatusCodes.Status404NotFound;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
        {
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails()
            {
                Title = ErrorResource.E404Title,
                Detail = ErrorResource.E404Detail
            },
            Exception = ex
        });
    }

    private async Task<bool> HandleInvalidFileFormatException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.StatusCode = StatusCodes.Status415UnsupportedMediaType;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
        {
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails()
            {
                Title = ErrorResource.E415Title,
                Detail = ErrorResource.InvalidFileFormat
            },
            Exception = ex
        });
    }

    private async Task<bool> HandleConflictException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.StatusCode = StatusCodes.Status409Conflict;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
        {
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails()
            {
                Title = ErrorResource.E409Title,
                Detail = ErrorResource.E409Detail
            },
            Exception = ex
        });
    }
}
