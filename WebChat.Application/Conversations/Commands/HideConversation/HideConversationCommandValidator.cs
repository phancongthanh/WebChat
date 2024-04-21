namespace WebChat.Application.Conversations.Commands.HideConversation;
public class HideConversationCommandValidator : AbstractValidator<HideConversationCommand>
{
    public HideConversationCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .OverridePropertyName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.ConversationId)
            .NotEmpty()
            .OverridePropertyName(ConversationResource.Conversation)
            .WithMessage(ValidationResource.Required);
    }
}
