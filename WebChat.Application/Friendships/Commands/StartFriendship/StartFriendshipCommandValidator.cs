namespace WebChat.Application.Friendships.Commands.StartFriendship;
public class StartFriendshipCommandValidator : AbstractValidator<StartFriendshipCommand>
{
    public StartFriendshipCommandValidator()
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
