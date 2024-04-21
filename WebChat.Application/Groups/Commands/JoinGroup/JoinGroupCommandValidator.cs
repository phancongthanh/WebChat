namespace WebChat.Application.Groups.Commands.JoinGroup;
public class JoinGroupCommandValidator : AbstractValidator<JoinGroupCommand>
{
    public JoinGroupCommandValidator()
    {
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
