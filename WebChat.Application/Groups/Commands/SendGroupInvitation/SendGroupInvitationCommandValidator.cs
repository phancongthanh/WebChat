namespace WebChat.Application.Groups.Commands.SendGroupInvitation;
public class SendGroupInvitationCommandValidator : AbstractValidator<SendGroupInvitationCommand>
{
    public SendGroupInvitationCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
           .NotEmpty()
           .WithName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.UserIds)
           .NotEmpty()
           .WithName(UserResource.UserId)
           .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .WithName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);
    }
}
