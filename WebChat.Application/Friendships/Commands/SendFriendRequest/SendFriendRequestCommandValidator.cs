namespace WebChat.Application.Friendships.Commands.SendFriendRequest;
public class SendFriendRequestCommandValidator : AbstractValidator<SendFriendRequestCommand>
{
    public SendFriendRequestCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(FriendResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.FriendId)
            .NotEmpty()
            .WithName(FriendResource.FriendId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.RequestTitle)
            .NotNull()
            .WithName(FriendResource.FriendRequestTitle)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.Description)
            .NotNull()
            .WithName(FriendResource.FriendDescription)
            .WithMessage(ValidationResource.Required);
    }
}
