namespace WebChat.Application.Conversations.Commands.DeleteConversation;
public class DeleteConversationCommandValidator : AbstractValidator<DeleteConversationCommand>
{
    public DeleteConversationCommandValidator()
    {
        RuleFor(v => v.CurrentUserId)
            .NotEmpty()
            .WithName(UserResource.UserId)
            .WithMessage(ValidationResource.Required);

        RuleFor(v => v.ConversationId)
            .NotEmpty()
            .WithName(ConversationResource.Conversation)
            .WithMessage(ValidationResource.Required);
    }
}
