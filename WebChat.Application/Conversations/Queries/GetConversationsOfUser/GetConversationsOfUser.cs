using WebChat.Application.Common.Models;

namespace WebChat.Application.Conversations.Queries.GetConversationsOfUser;

public class GetConversationsOfUserQuery : IRequest<IEnumerable<ConversationInfo>>, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
}

public class GetConversationsOfUserQueryHandler(IConversationRepository repository) : IRequestHandler<GetConversationsOfUserQuery, IEnumerable<ConversationInfo>>
{
    public async Task<IEnumerable<ConversationInfo>> Handle(GetConversationsOfUserQuery request, CancellationToken cancellationToken)
    {
        var conversations = await repository.GetListOfUserAsync(request.CurrentUserId, cancellationToken);
        var dtos = conversations.Select(conversation => new ConversationInfo(conversation, request.CurrentUserId));
        return dtos;
    }
}
