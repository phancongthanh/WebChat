namespace WebChat.Application.Groups.Commands.CreateGroup;
public class CreateGroupCommandValidator : AbstractValidator<CreateGroupCommand>
{
    public CreateGroupCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupName)
            .NotEmpty()
            .WithName(GroupResource.GroupName)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.MemberIds.Count(id => id != v.CurrentUserId))
            .GreaterThanOrEqualTo(2)
            .WithName(GroupResource.Member)
            .WithMessage(GroupResource.NotEnoughMembers);
    }
}
