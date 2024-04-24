using FluentValidation.Results;

namespace WebChat.Application.Common.Exceptions;
public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException()
        : base("One or more validation failures have occurred.")
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }

    public ValidationException(IDictionary<string, string[]> errors)
    {
        Errors = errors;
    }

    public ValidationException(string resourceName, string[] messages) : this()
    {
        Errors = new Dictionary<string, string[]>
        {
            { resourceName, messages }
        };
    }

    public ValidationException(string resourceName, string message) : this(resourceName, [message]) { }
    public ValidationException(string[] messages) : this(string.Empty, messages) { }
    public ValidationException(string message) : this(string.Empty, message) { }
}
