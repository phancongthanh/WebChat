namespace WebChat.Application.Friendships.Commands.UpdateFriendInfo;
public class UpdateFriendInfoCommandValidator : AbstractValidator<UpdateFriendInfoCommand>
{
    public UpdateFriendInfoCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(FriendResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.FriendId)
            .NotEmpty()
            .OverridePropertyName(FriendResource.FriendId)
            .WithMessage(ValidationResource.Required);
    }
}
