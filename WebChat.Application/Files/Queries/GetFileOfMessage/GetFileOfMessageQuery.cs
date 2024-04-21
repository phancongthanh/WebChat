using WebChat.Application.Common.Models;

namespace WebChat.Application.Files.Queries.GetFileOfMessage;

[Authorize]
public class GetFileOfMessageQuery : IRequest<FileData<Stream>>, ICurrentUser
{
    public Guid ConversationId { get; init; }
    public Guid CurrentUserId { get; init; }
    public long MessageId { get; init; }
    public required string FilePath { get; init; }
}

public class GetFileOfMessageQueryHandler(IConversationRepository repository, IFileStore fileStore) : IRequestHandler<GetFileOfMessageQuery, FileData<Stream>>
{
    public async Task<FileData<Stream>> Handle(GetFileOfMessageQuery request, CancellationToken cancellationToken)
    {
        var conversation = await repository.GetWithoutMessagesAsync(request.ConversationId, cancellationToken);
        var member = conversation.Members.Where(m => m.UserId == request.CurrentUserId).SingleOrDefault()
            ?? throw new ForbiddenAccessException("The current user does not have permission to access this conversation.");

        var message = await repository.GetMessageAsync(request.MessageId, cancellationToken);
        if (message.ConversationId != conversation.ConversationId)
            throw new ForbiddenAccessException("The message is not in the conversation.");

        var file = message.Files.Where(f => f.Path == request.FilePath).SingleOrDefault()
            ?? throw new ForbiddenAccessException("The file is not in message.");

        var data = await fileStore.GetAsync(file.Path, cancellationToken);
        data = Guard.Against.Null(data);

        return new FileData<Stream>(file, data);
    }
}
