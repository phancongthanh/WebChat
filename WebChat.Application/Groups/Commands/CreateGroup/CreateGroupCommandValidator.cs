namespace WebChat.Application.Groups.Commands.CreateGroup;
public class CreateGroupCommandValidator : AbstractValidator<CreateGroupCommand>
{
    public CreateGroupCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupName)
            .NotEmpty()
            .OverridePropertyName(GroupResource.GroupName)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.MemberIds.Count(id => id != v.CurrentUserId))
            .GreaterThanOrEqualTo(2)
            .OverridePropertyName(GroupResource.Member)
            .WithMessage(GroupResource.NotEnoughMembers);
    }
}
