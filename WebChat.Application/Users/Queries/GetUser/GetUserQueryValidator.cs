namespace WebChat.Application.Users.Queries.GetUser;
public class GetUserQueryValidator : AbstractValidator<GetUserQuery>
{
    public GetUserQueryValidator()
    {
        RuleFor(v => v.UserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);
    }
}
