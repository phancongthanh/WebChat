namespace WebChat.Application.Conversations.Commands.DeleteMessage;

public class DeleteMessageCommandValidator : AbstractValidator<DeleteMessageCommand>
{
    public DeleteMessageCommandValidator()
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
