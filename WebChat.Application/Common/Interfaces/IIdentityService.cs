namespace WebChat.Application.Common.Interfaces;
public interface IIdentityService
{
    #region Identity
    Task<string?> GetUserNameAsync(Guid userId);
    Task<Guid> CreateUserAsync(string userName, string password);
    Task ChangePassword(string userName, string oldPassword, string newPassword);
    Task DeleteUserAsync(Guid userId);
    #endregion

    #region Authorization
    Task<bool> IsInRoleAsync(Guid userId, string role);
    Task<bool> AuthorizeAsync(Guid userId, string policyName); 
    #endregion
}
