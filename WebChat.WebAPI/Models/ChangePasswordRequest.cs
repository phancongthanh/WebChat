namespace WebChat.WebAPI.Models;

public class ChangePasswordRequest
{
    public required string Country { get; set; }
    public required string Phone { get; set; }
    public required string OldPassword { get; set; }
    public required string NewPassword { get; set; }
}
