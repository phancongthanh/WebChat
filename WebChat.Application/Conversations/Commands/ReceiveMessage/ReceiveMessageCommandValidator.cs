namespace WebChat.Application.Conversations.Commands.ReceiveMessage;

public class ReceiveMessageCommandValidator : AbstractValidator<ReceiveMessageCommand>
{
    public ReceiveMessageCommandValidator()
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
