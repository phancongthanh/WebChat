using WebChat.Domain.Enums;

namespace WebChat.WebAPI.Models;

public class RegisterRequest
{
    public string CountryCode { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public DateTimeOffset Birthday { get; set; }

    public Gender Gender { get; set; }

    public string Password { get; set; } = string.Empty;
}
