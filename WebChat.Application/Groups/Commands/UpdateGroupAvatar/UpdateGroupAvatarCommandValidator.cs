namespace WebChat.Application.Groups.Commands.UpdateGroupAvatar;
public class UpdateGroupAvatarCommandValidator : AbstractValidator<UpdateGroupAvatarCommand>
{
    public UpdateGroupAvatarCommandValidator()
    {
        RuleFor(v => v.GroupId)
            .NotEmpty()
            .WithName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.File)
            .Must(file => file.CanRead)
            .WithName(GroupResource.AvatarPath)
            .WithMessage(FileResource.CantRead);
    }
}
