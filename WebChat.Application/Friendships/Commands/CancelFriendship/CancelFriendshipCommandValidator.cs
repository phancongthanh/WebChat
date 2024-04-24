namespace WebChat.Application.Friendships.Commands.CancelFriendship;
public class CancelFriendshipCommandValidator : AbstractValidator<CancelFriendshipCommand>
{
    public CancelFriendshipCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(FriendResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.FriendId)
            .NotEmpty()
            .WithName(FriendResource.FriendId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v)
            .Must(v => v.CurrentUserId != v.FriendId)
            .WithMessage(FriendResource.FriendMustNotBeCurrentUser);
    }
}
