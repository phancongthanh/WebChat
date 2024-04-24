namespace WebChat.Application.Users.Commands.UpdateUser;

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.Name)
            .NotEmpty()
            .WithName(UserResource.Name)
            .WithMessage(ValidationResource.Required);
        RuleFor(v => v.Name)
            .MaximumLength(50)
            .WithName(UserResource.Name)
            .WithMessage(ValidationResource.MaxLength);

        RuleFor(v => v.Birthday)
            .LessThan(DateTimeOffset.Now)
            .WithName(UserResource.Birthday)
            .WithMessage(ValidationResource.InvalidBirthday);

        RuleFor(v => v.Gender)
            .IsInEnum()
            .WithName(UserResource.Gender)
            .WithMessage(ValidationResource.InvalidGender);
    }
}
