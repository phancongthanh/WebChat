namespace WebChat.Application.Common.Models;

public class FileData<T>(FileMetadata metadata, T data)
{
    public FileMetadata Metadata { get; set; } = metadata;

    public T Data { get; set; } = data;
}
