namespace WebChat.Application.Conversations.Commands.ReadMessage;

public class ReadMessageCommandValidator : AbstractValidator<ReadMessageCommand>
{
    public ReadMessageCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.ConversationId)
            .NotEmpty()
            .WithName(ConversationResource.Conversation)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.MessageId).GreaterThan(0)
            .WithName(MessageResource.Message)
            .WithMessage(ValidationResource.Required);
    }
}
