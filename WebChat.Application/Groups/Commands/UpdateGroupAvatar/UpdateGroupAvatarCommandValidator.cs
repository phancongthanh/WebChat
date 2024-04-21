namespace WebChat.Application.Groups.Commands.UpdateGroupAvatar;
public class UpdateGroupAvatarCommandValidator : AbstractValidator<UpdateGroupAvatarCommand>
{
    public UpdateGroupAvatarCommandValidator()
    {
        RuleFor(v => v.GroupId)
            .NotEmpty()
            .OverridePropertyName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.File)
            .Must(file => file.CanRead)
            .OverridePropertyName(GroupResource.AvatarPath)
            .WithMessage(FileResource.CantRead);
    }
}
