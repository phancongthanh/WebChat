namespace WebChat.Application.Conversations.Commands.ReceiveMessage;

public class ReceiveMessageCommandValidator : AbstractValidator<ReceiveMessageCommand>
{
    public ReceiveMessageCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.ConversationId)
            .NotEmpty()
            .OverridePropertyName(ConversationResource.Conversation)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.MessageId).GreaterThan(0)
            .OverridePropertyName(MessageResource.Message)
            .WithMessage(ValidationResource.Required);
    }
}
