namespace WebChat.Application.Common.Models;
public class SystemInfoOptions
{
    public const string SectionName = "SystemInfo";

    public string Version { get; set; } = "1.0.0";

    public string AppName { get; set; } = "WebChat";

    public string Email { get; set; } = "phancongthanhvtvpvn@gmail.com";

    public PhoneNumber AdminPhone { get; set; } = PhoneNumber.From("84", "0382441609");

    public string GlobalGroupCode { get; set; } = "WebChat";

    // MB
    public double MaxFileSize { get; set; } = 0.5d;

    public int MaxFileCountPerMessage { get; set; } = 5;
}
