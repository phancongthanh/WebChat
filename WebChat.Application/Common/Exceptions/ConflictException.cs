namespace WebChat.Application.Common.Exceptions;
public class ConflictException(string name, string? key = null) : Exception
{
    public string ResourceName { get; private set; } = name;
    public string? ResourceKey { get; private set; } = key;
}
