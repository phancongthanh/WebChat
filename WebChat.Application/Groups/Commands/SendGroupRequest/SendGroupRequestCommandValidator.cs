namespace WebChat.Application.Groups.Commands.SendGroupRequest;
public class SendGroupRequestCommandValidator : AbstractValidator<SendGroupRequestCommand>
{
    public SendGroupRequestCommandValidator()
    {
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
