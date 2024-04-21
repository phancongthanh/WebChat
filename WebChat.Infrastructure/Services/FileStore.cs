namespace WebChat.Infrastructure.Services;

internal class FileStoreOptions
{
    public const string SectionName = "FileStore";

    public string BasePath { get; set; } = "Data";

    public IDictionary<string, string> PathMap { get; set; } = new Dictionary<string, string>();
}

internal class FileStore(FileStoreOptions options) : IFileStore
{
    public async Task<string> AddAsync(Stream file, CancellationToken cancellationToken = default)
    {
        var path = Path.GetRandomFileName();
        var actualPath = Path.Combine(options.BasePath, path);

        if (!Directory.Exists(options.BasePath))
        {
            Directory.CreateDirectory(options.BasePath);
        }
        using var stream = File.Create(actualPath);
        
        await file.CopyToAsync(stream, cancellationToken);

        return path;
    }

    public Task DeleteAsync(string path, CancellationToken cancellationToken = default)
    {
        if (!options.PathMap.TryGetValue(path, out var actualPath))
            actualPath = Path.Combine(options.BasePath, path);

        File.Delete(actualPath);

        return Task.CompletedTask;
    }

    public Task<Stream?> GetAsync(string path, CancellationToken cancellationToken = default)
    {
        if (!options.PathMap.TryGetValue(path, out var actualPath))
            actualPath = Path.Combine(options.BasePath, path);

        try
        {
            var file = File.OpenRead(actualPath);
            return Task.FromResult<Stream?>(file);
        }
        catch (FileNotFoundException)
        {
            return Task.FromResult<Stream?>(null);
        }
    }
}
