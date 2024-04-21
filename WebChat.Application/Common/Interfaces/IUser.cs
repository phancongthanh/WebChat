namespace WebChat.Application.Common.Interfaces;

public interface IUser
{
    Guid? Id { get; }

    Guid GetId() => Id ?? throw new UnauthorizedAccessException();
}
