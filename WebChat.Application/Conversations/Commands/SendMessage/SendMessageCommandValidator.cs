using WebChat.Application.Common.Models;

namespace WebChat.Application.Conversations.Commands.SendMessage;
public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    public SendMessageCommandValidator(SystemInfoOptions systemInfo)
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.ConversationId)
            .NotEmpty()
            .WithName(ConversationResource.Conversation)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v).Must(m => !string.IsNullOrEmpty(m.Text) || (m.Files != null && m.Files.Any()))
            .WithName(MessageResource.Message)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.Files)
            .Must(files => files.Count() <= systemInfo.MaxFileCountPerMessage)
            .WithName(MessageResource.Message)
            .WithMessage(MessageResource.TooManyFiles);

        RuleFor(v => v.Files)
            .Must(files => files.All(file => file.Info.Size <= systemInfo.MaxFileSize * 1024 * 1024))
            .Must(files => files.All(file => file.File.Length <= systemInfo.MaxFileSize * 1024 * 1024))
            .WithName(MessageResource.File)
            .WithMessage(MessageResource.TooLargeFileSize);
    }
}
