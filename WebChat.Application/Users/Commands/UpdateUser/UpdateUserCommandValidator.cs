namespace WebChat.Application.Users.Commands.UpdateUser;

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.Name)
            .NotEmpty()
            .OverridePropertyName(UserResource.Name)
            .WithMessage(ValidationResource.Required);
        RuleFor(v => v.Name)
            .MaximumLength(50)
            .OverridePropertyName(UserResource.Name)
            .WithMessage(ValidationResource.MaxLength);

        RuleFor(v => v.Birthday)
            .LessThan(DateTimeOffset.Now)
            .OverridePropertyName(UserResource.Birthday)
            .WithMessage(ValidationResource.InvalidBirthday);

        RuleFor(v => v.Gender)
            .IsInEnum()
            .OverridePropertyName(UserResource.Gender)
            .WithMessage(ValidationResource.InvalidGender);
    }
}
