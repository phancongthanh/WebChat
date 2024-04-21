namespace WebChat.Application.Common.Models;

public class UserInfo(User user, Friendship? fsOfUser = default, Friendship? fsOfFriend = default)
{
    public Guid UserId { get; set; } = user.UserId;

    public bool Avatar { get; set; } = user.AvatarPath != null;
    public string Name { get; set; } = user.Name;
    public Gender Gender { get; set; } = user.Gender;
    public DateTime Birthday { get; set; } = user.Birthday;
    public string? Alias { get; set; } = fsOfUser?.FriendAlias;
    public PhoneNumber? Phone { get; set; } = fsOfUser?.FriendPhone;
    public bool IsFriend { get; set; } = fsOfUser?.IsFriend == true;
    public Guid? ConversationId { get; set; } = fsOfUser?.ConversationId;
    public bool Blocked { get; set; } = fsOfUser?.Blocked ?? false;
    public bool BeBlocked { get; set; } = fsOfFriend?.Blocked ?? false;

    public FriendRequest? RequestOfUser { get; set; } = fsOfUser?.Request;
    public FriendRequest? RequestOfFriend { get; set; } = fsOfFriend?.Request;
}
