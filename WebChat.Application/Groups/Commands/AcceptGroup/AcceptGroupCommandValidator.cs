namespace WebChat.Application.Groups.Commands.AcceptGroup;
public class AcceptGroupCommandValidator : AbstractValidator<AcceptGroupCommand>
{
    public AcceptGroupCommandValidator()
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
