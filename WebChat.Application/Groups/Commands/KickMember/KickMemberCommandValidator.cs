namespace WebChat.Application.Groups.Commands.KickMember;
public class KickMemberCommandValidator : AbstractValidator<KickMemberCommand>
{
    public KickMemberCommandValidator()
    {
        RuleFor(v => v.UserId)
           .NotEmpty()
           .WithName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.CurrentUserId)
           .NotEmpty()
           .WithName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .WithName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);
    }
}
