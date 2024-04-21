namespace WebChat.Domain.Entities;

public class Message : DeleteEntity<long>
{
    public long MessageId { get; set; }

    public Guid ConversationId { get; set; } = Guid.Empty;

    public Guid FromUserId { get; set; } = Guid.Empty;

    public DateTime SendTime { get; set; }

    public string Text { get; set; } = string.Empty;

    public MessageStatus Status { get; set; } = MessageStatus.Sent;

    public virtual ICollection<FileMetadata> Files { get; set; } = [];

    public override long GetId() => MessageId;
}
