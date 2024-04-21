namespace WebChat.Application.Friendships.Commands.SendFriendRequest;
public class SendFriendRequestCommandValidator : AbstractValidator<SendFriendRequestCommand>
{
    public SendFriendRequestCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(FriendResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.FriendId)
            .NotEmpty()
            .OverridePropertyName(FriendResource.FriendId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.RequestTitle)
            .NotNull()
            .OverridePropertyName(FriendResource.FriendRequestTitle)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.Description)
            .NotNull()
            .OverridePropertyName(FriendResource.FriendDescription)
            .WithMessage(ValidationResource.Required);
    }
}
