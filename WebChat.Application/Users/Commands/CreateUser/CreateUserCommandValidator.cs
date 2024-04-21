namespace WebChat.Application.Users.Commands.CreateUser;
public class CreateAccountUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateAccountUserValidator()
    {
        RuleFor(v => v.UserId)
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

        RuleFor(v => v.CountryCode)
            .NotEmpty()
            .Matches("^\\d{1,3}$")
            .OverridePropertyName(PhoneNumberResource.CountryCode)
            .WithMessage(PhoneNumberResource.InvalidCountryCode);
        RuleFor(v => v.PhoneNumber)
            .NotEmpty()
            .Matches("^\\d{7,15}$")
            .OverridePropertyName(PhoneNumberResource.SubcriberNumber)
            .WithMessage(PhoneNumberResource.InvalidSubcriberNumber);
    }
}
