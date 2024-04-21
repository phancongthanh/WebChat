namespace WebChat.Domain.ValueObjects;

/// <summary>
/// Dữ liệu lưu trữ file
/// </summary>
public class FileMetadata(string path, string contentType, long size)
{
    /// <summary>
    /// Đường dẫn để truy xuất file
    /// </summary>
    public string Path { get; set; } = path;
    /// <summary>
    /// Tên file
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Dung lượng file
    /// </summary>
    public long Size { get; set; } = size;
    /// <summary>
    /// Kiểu dữ liệu của file
    /// </summary>
    public string ContentType { get; set; } = contentType;
    /// <summary>
    /// Ngày tạo file
    /// </summary>
    public DateTime CreatedDate { get; set; } = DateTime.Now;
}
