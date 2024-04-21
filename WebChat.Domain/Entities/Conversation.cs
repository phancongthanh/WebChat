namespace WebChat.Domain.Entities;

public class Conversation : AuditableEntity, IAggregateRoot
{
    public ConversationType Type { get; set; } = ConversationType.Unknown;

    public Guid ConversationId { get; set; } = Guid.Empty;

    public virtual ICollection<ConversationMember> Members { get; set; } = [];

    public virtual ICollection<Message> Messages { get; set; } = [];

    public override Guid GetId() => ConversationId;
}

public class ConversationMember : AuditableEntity<(Guid ConversationId, Guid UserId)>
{
    public Guid ConversationId { get; set; } = Guid.Empty;

    public Guid UserId { get; set; } = Guid.Empty;

    public bool IsHidden { get; set; } = false;

    public long ReceivedToId { get; set; } = 0;

    public long SeenToId { get; set; } = 0;

    public long LoadFromId { get; set; } = 0;


    public IList<long> HiddenMessageIds { get; set; } = [];

    public bool IsBlock { get; set; } = false;

    public override (Guid ConversationId, Guid UserId) GetId() => (ConversationId, UserId);
}
