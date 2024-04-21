namespace WebChat.Application.Groups.Commands.KickMember;
public class KickMemberCommandValidator : AbstractValidator<KickMemberCommand>
{
    public KickMemberCommandValidator()
    {
        RuleFor(v => v.UserId)
           .NotEmpty()
           .OverridePropertyName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.CurrentUserId)
           .NotEmpty()
           .OverridePropertyName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .OverridePropertyName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);
    }
}
