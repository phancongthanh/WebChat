namespace WebChat.Application.Groups.Commands.SendGroupInvitation;
public class SendGroupInvitationCommandValidator : AbstractValidator<SendGroupInvitationCommand>
{
    public SendGroupInvitationCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
           .NotEmpty()
           .OverridePropertyName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.UserIds)
           .NotEmpty()
           .OverridePropertyName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .OverridePropertyName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);
    }
}
