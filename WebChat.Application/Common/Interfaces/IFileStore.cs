namespace WebChat.Application.Common.Interfaces;

public interface IFileStore
{
    Task<string> AddAsync(Stream file, CancellationToken cancellationToken = default);

    Task<Stream?> GetAsync(string path, CancellationToken cancellationToken = default);

    Task DeleteAsync(string path, CancellationToken cancellationToken = default);
}
