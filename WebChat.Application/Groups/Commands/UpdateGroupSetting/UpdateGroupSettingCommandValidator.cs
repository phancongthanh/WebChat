using System.Text.RegularExpressions;

namespace WebChat.Application.Groups.Commands.UpdateGroupSetting;
public class UpdateGroupSettingCommandValidator : AbstractValidator<UpdateGroupSettingCommand>
{
    public UpdateGroupSettingCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.GroupId)
            .NotEmpty()
            .OverridePropertyName(GroupResource.GroupId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.Setting.GroupCode)
            .Matches(new Regex("^\\w{4,10}$"))
            .OverridePropertyName(GroupResource.GroupCode)
            .WithMessage(GroupResource.InvalidGroupCode);
    }
}
