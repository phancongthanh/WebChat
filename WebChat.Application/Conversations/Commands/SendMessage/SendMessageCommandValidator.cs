namespace WebChat.Application.Conversations.Commands.SendMessage;
public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    public SendMessageCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.ConversationId)
            .NotEmpty()
            .OverridePropertyName(ConversationResource.Conversation)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v).Must(m => !string.IsNullOrEmpty(m.Text) || (m.Files != null && m.Files.Any()))
            .OverridePropertyName(MessageResource.Message)
            .WithMessage(ValidationResource.Required);
    }
}
