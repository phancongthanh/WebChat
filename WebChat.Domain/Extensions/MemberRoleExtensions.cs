namespace WebChat.Domain.Extensions;

public static class MemberRoleExtensions
{
    public static bool IsAdmin(this MemberRole role) => role == MemberRole.Leader || role == MemberRole.DeputyGroup;
}
