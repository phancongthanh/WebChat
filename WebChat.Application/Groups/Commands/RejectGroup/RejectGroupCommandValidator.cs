namespace WebChat.Application.Groups.Commands.RejectGroup;
public class RejectGroupCommandValidator : AbstractValidator<RejectGroupCommand>
{
    public RejectGroupCommandValidator()
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
