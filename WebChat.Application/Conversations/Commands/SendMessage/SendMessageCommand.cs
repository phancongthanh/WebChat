using WebChat.Domain.Events.Conversations;
using WebChat.Domain.Interfaces;

namespace WebChat.Application.Conversations.Commands.SendMessage;

public record SendMessageCommand : IRequest<long>, ICurrentUser
{
    public Guid ConversationId { get; init; }

    public Guid CurrentUserId { get; init; }

    public string Text { get; init; } = string.Empty;

    public required IEnumerable<(FileMetadata Info, Stream File)> Files { get; init; } = [];
}

public class SendMessageCommandHandler(IConversationRepository repository, IFileStore fileStore, IMessageIdGenerator idGenerator)
    : IRequestHandler<SendMessageCommand, long>
{
    public async Task<long> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var conversation = await repository
            .GetWithoutMessagesAsync(request.ConversationId, cancellationToken);
        // Domain validation
        var member = conversation.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new ForbiddenAccessException()
                .WithDetail(ConversationResource.IsNotMember)
                .WithCode(nameof(ConversationResource.IsNotMember));
        if (member.IsBlock)
            throw new ForbiddenAccessException()
                .WithDetail(ConversationResource.IsBlock)
                .WithCode(nameof(ConversationResource.IsBlock));

        // Save files
        var files = new List<FileMetadata>();
        foreach (var (info, stream) in request.Files)
        {
            var key = await fileStore.AddAsync(stream, cancellationToken);
            info.Path = key;
            files.Add(info);
        }
        // Create message
        var message = new Message()
        {
            MessageId = idGenerator.GenerateMessageId(),
            ConversationId = request.ConversationId,
            FromUserId = request.CurrentUserId,
            SendTime = DateTime.UtcNow,
            Text = request.Text,
            Status = MessageStatus.Sent,
            Files = files,
        };
        conversation.Messages.Add(message);
        // Create domain event
        var domainEvent = new MessageSentEvent(message);
        conversation.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await repository.AddMessageAsync(conversation, message.MessageId, cancellationToken);
            return message.MessageId;
        }
        catch (Exception)
        {
            foreach (var file in files)
                await fileStore.DeleteAsync(file.Path, cancellationToken);
            throw;
        }
    }
}
