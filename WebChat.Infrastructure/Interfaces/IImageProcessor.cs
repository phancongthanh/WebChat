namespace WebChat.Infrastructure.Interfaces;
public interface IImageProcessor
{
    Task<Stream> NormalizeAsync(Stream stream, CancellationToken cancellationToken = default);
}
