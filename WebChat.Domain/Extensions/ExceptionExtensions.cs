using WebChat.Domain.Constants;

namespace WebChat.Domain.Extensions;
public static class ExceptionExtensions
{
    public static T WithData<T>(this T exception, string key, object? value) where T : Exception
    {
        exception.Data[key] = value;
        return exception;
    }

    public static T WithDetail<T>(this T exception, string message) where T : Exception
    {
        return exception.WithData(ErrorConstants.Detail, message);
    }

    public static T WithCode<T>(this T exception, string code) where T : Exception
    {
        return exception.WithData(ErrorConstants.Code, code);
    }
}
