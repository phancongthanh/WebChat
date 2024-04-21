namespace WebChat.Application.Users.Queries.GetUserByPhone;
internal class GetUserByPhoneQueryValidator : AbstractValidator<GetUserByPhoneQuery>
{
    public GetUserByPhoneQueryValidator()
    {
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
