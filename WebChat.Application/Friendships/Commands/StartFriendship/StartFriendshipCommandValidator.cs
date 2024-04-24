namespace WebChat.Application.Friendships.Commands.StartFriendship;
public class StartFriendshipCommandValidator : AbstractValidator<StartFriendshipCommand>
{
    public StartFriendshipCommandValidator()
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
