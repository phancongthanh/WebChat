namespace WebChat.Application.Conversations.Commands.ReadMessage;

public class ReadMessageCommandValidator : AbstractValidator<ReadMessageCommand>
{
    public ReadMessageCommandValidator()
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
