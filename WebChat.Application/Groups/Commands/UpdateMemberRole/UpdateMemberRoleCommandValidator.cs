namespace WebChat.Application.Groups.Commands.UpdateMemberRole;
public class UpdateMemberRoleCommandValidator : AbstractValidator<UpdateMemberRoleCommand>
{
    public UpdateMemberRoleCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.UserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .WithName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.Role)
            .IsInEnum()
            .WithMessage(GroupResource.InvalidRole);
    }
}
