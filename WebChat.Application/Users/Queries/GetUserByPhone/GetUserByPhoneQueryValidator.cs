namespace WebChat.Application.Users.Queries.GetUserByPhone;
internal class GetUserByPhoneQueryValidator : AbstractValidator<GetUserByPhoneQuery>
{
    public GetUserByPhoneQueryValidator()
    {
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
