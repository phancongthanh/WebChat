namespace WebChat.Application.Groups.Commands.AcceptGroup;
public class AcceptGroupCommandValidator : AbstractValidator<AcceptGroupCommand>
{
    public AcceptGroupCommandValidator()
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
