namespace WebChat.Application.Groups.Commands.UpdateGroupName;
public class UpdateGroupNameCommandValidator : AbstractValidator<UpdateGroupNameCommand>
{
    public UpdateGroupNameCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .OverridePropertyName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupName)
            .NotEmpty()
            .OverridePropertyName(GroupResource.GroupName)
            .WithMessage(ValidationResource.Required);
    }
}
