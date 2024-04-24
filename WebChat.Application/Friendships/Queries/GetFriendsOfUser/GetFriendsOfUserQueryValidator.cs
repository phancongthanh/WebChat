namespace WebChat.Application.Friendships.Queries.GetFriendsOfUser;
public class GetFriendsOfUserQueryValidator : AbstractValidator<GetFriendsOfUserQuery>
{
    public GetFriendsOfUserQueryValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);
    }
}
