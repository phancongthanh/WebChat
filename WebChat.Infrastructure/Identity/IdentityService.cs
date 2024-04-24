using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebChat.Application.Common.Exceptions;
using WebChat.Domain.Extensions;

namespace WebChat.Infrastructure.Identity;
public class IdentityService(
    UserManager<ApplicationUser> userManager,
    IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
    IAuthorizationService authorizationService)
    : IIdentityService
{
    #region Identity
    public async Task<string?> GetUserNameAsync(Guid userId)
    {
        var user = await userManager.Users.FirstAsync(u => u.Id == userId);

        return user.UserName;
    }
    public async Task<Guid> CreateUserAsync(string userName, string password)
    {
        var user = new ApplicationUser { UserName = userName };

        var result = await userManager.CreateAsync(user, password);
        if (result.Succeeded) return user.Id;

        throw new ValidationException(result.Errors.ToDictionary(e => e.Code, e => new [] { e.Description }));
    }
    public async Task ChangePassword(string userName, string oldPassword, string newPassword)
    {
        // Check
        var user = await userManager.Users
            .Where(x => x.UserName == userName)
            .SingleOrDefaultAsync()
            ?? throw new ValidationException()
                .WithDetail(IdentityResource.AccountNotExist)
                .WithCode(nameof(IdentityResource.AccountNotExist));

        await userManager.ChangePasswordAsync(user, oldPassword, newPassword);
    }
    public async Task DeleteUserAsync(Guid userId)
    {
        var user = userManager.Users.SingleOrDefault(u => u.Id == userId);
        if (user == null) return;

        var result = await userManager.DeleteAsync(user);
        if (result.Succeeded) return;

        throw new ValidationException(result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description }));
    }
    #endregion

    #region Authorization
    public async Task<bool> IsInRoleAsync(Guid userId, string role)
    {
        var user = userManager.Users.SingleOrDefault(u => u.Id == userId);
        return user != null && await userManager.IsInRoleAsync(user, role);
    }
    public async Task<bool> AuthorizeAsync(Guid userId, string policyName)
    {
        var user = userManager.Users.SingleOrDefault(u => u.Id == userId);
        if (user == null)
            return false;
        var principal = await userClaimsPrincipalFactory.CreateAsync(user);
        var result = await authorizationService.AuthorizeAsync(principal, policyName);
        return result.Succeeded;
    }
    #endregion
}
