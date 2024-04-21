namespace WebChat.WebAPI.Models;

public class LoginRequest
{
    public required string Country { get; set; }
    public required string Phone { get; set; }
    public required string Password { get; set; }
}
