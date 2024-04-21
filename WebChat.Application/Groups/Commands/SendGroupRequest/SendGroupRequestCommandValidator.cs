namespace WebChat.Application.Groups.Commands.SendGroupRequest;
public class SendGroupRequestCommandValidator : AbstractValidator<SendGroupRequestCommand>
{
    public SendGroupRequestCommandValidator()
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
