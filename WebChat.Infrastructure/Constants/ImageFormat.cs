using SixLabors.ImageSharp.Formats.Jpeg;

namespace WebChat.Infrastructure.Constants;
public static class ImageFormat
{
    public const string DefaultMimeType = "image/jpeg"; //JpegFormat.Instance.DefaultMimeType;

    public static readonly IEnumerable<string> SupportedMimeTypes = JpegFormat.Instance.MimeTypes;
}
