using WebChat.Application.Common.Models;

namespace WebChat.Application.Conversations.Queries.GetConversation;

[Authorize]
public record GetConversationQuery : IRequest<ConversationInfo>, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }
}

public class GetConversationQueryHandler(IConversationRepository repository) : IRequestHandler<GetConversationQuery, ConversationInfo>
{
    public async Task<ConversationInfo> Handle(GetConversationQuery request, CancellationToken cancellationToken)
    {
        var conversation = await repository.GetAsync(request.ConversationId, cancellationToken);

        // Domain validate
        if (!conversation.Members.Any(m => m.UserId == request.CurrentUserId))
            throw new ForbiddenAccessException(ConversationResource.IsNotMember);

        var dto = new ConversationInfo(conversation, request.CurrentUserId);

        return dto;
    }
}
