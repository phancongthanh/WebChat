namespace WebChat.Application.Friendships.Commands.UpdateFriendInfo;
public class UpdateFriendInfoCommandValidator : AbstractValidator<UpdateFriendInfoCommand>
{
    public UpdateFriendInfoCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(FriendResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.FriendId)
            .NotEmpty()
            .WithName(FriendResource.FriendId)
            .WithMessage(ValidationResource.Required);
    }
}
