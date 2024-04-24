
using WebChat.Domain.Interfaces.Repositories;

namespace WebChat.Application.Conversations.Queries.LoadMessages;

[Authorize]
public class LoadMessagesQuery : IRequest<IEnumerable<Message>>, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }

    public long MessageId { get; init; }

    public int Count { get; init; } = 5;
}

public class LoadMessagesQueryHandler(IConversationRepository repository) : IRequestHandler<LoadMessagesQuery, IEnumerable<Message>>
{
    public async Task<IEnumerable<Message>> Handle(LoadMessagesQuery request, CancellationToken cancellationToken)
    {
        var conversation = await repository.GetWithoutMessagesAsync(request.ConversationId, cancellationToken);
        var member = conversation.Members.Where(m => m.UserId == request.CurrentUserId).SingleOrDefault()
            ?? throw new ForbiddenAccessException()
                .WithDetail(ConversationResource.IsNotMember)
                .WithCode(nameof(ConversationResource.IsNotMember));
        
        var messages = await repository
            .GetMessageListAsync(
            request.ConversationId,
            request.MessageId,
            member.LoadFromId,
            request.Count,
            cancellationToken);

        return messages;
    }
}
