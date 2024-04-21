namespace WebChat.Application.Conversations.Commands.HideMessage;

public class HideMessageCommandValidator : AbstractValidator<HideMessageCommand>
{
    public HideMessageCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.ConversationId)
            .NotEmpty()
            .OverridePropertyName(ConversationResource.Conversation)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.MessageId).GreaterThan(0).OverridePropertyName(MessageResource.Message)
            .WithMessage(ValidationResource.Required);
    }
}
