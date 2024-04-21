namespace WebChat.Infrastructure.Exceptions;
public class InvalidFileFormatException : Exception
{
    public InvalidFileFormatException() : base("File format is invalid.") { }
    public InvalidFileFormatException(string message) : base(message) { }
    public InvalidFileFormatException(string message,  Exception innerException) : base(message, innerException) { }
}
