namespace WebChat.Application.Groups.Commands.UpdateGroupName;
public class UpdateGroupNameCommandValidator : AbstractValidator<UpdateGroupNameCommand>
{
    public UpdateGroupNameCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .WithName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupName)
            .NotEmpty()
            .WithName(GroupResource.GroupName)
            .WithMessage(ValidationResource.Required);
    }
}
