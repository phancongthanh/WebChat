namespace WebChat.Application.Users.Commands.UpdateUserAvatar;
public class UpdateGroupAvatarCommandValidator : AbstractValidator<UpdateUserAvatarCommand>
{
    public UpdateGroupAvatarCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.File)
            .Must(file => file.CanRead)
            .WithName(UserResource.AvatarPath)
            .WithMessage(FileResource.CantRead);
    }
}
