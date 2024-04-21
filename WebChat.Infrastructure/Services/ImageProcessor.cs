using WebChat.Infrastructure.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using WebChat.Infrastructure.Exceptions;

namespace WebChat.Infrastructure.Services;
internal class ImageProcessor : IImageProcessor
{
    public async Task<Stream> NormalizeAsync(Stream stream, CancellationToken cancellationToken = default)
    {
        // Preparing
        try
        {
            using var image = await Image.LoadAsync(stream, cancellationToken);

            // Convert
            if (image.Width > image.Height)
            {
                var width = 100.0 * image.Width / image.Height;
                image.Mutate(x => x.Resize((int)width, 100));
            }
            else
            {
                var height = 100.0 * image.Height / image.Width;
                image.Mutate(x => x.Resize(100, (int)height));
            }
            // Return
            var result = new MemoryStream();
            await image.SaveAsJpegAsync(result, cancellationToken);
            result.Position = 0;
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidFileFormatException(ex.Message, ex);
        }
    }
}
