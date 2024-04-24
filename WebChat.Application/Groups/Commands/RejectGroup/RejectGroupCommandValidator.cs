namespace WebChat.Application.Groups.Commands.RejectGroup;
public class RejectGroupCommandValidator : AbstractValidator<RejectGroupCommand>
{
    public RejectGroupCommandValidator()
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
