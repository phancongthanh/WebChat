namespace WebChat.Application.Users.Commands.CreateUser;
public class CreateAccountUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateAccountUserValidator()
    {
        RuleFor(v => v.UserId)
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

        RuleFor(v => v.CountryCode)
            .NotEmpty()
            .Matches("^\\d{1,3}$")
            .WithName(PhoneNumberResource.CountryCode)
            .WithMessage(PhoneNumberResource.InvalidCountryCode);
        RuleFor(v => v.PhoneNumber)
            .NotEmpty()
            .Matches("^\\d{7,15}$")
            .WithName(PhoneNumberResource.SubcriberNumber)
            .WithMessage(PhoneNumberResource.InvalidSubcriberNumber);
    }
}
