namespace WebChat.Application.Common.Models;
public class ConversationInfo
{
    public ConversationType Type { get; set; } = ConversationType.Unknown;

    public Guid ConversationId { get; set; } = Guid.Empty;

    public MessageStatus Status { get; set; } = MessageStatus.Sending;

    public Message[] Messages { get; set; } = [];

    public bool IsHidden { get; set; } = false;

    public long ReceivedToId { get; set; } = 0;

    public long SeenToId { get; set; } = 0;

    public long LoadFromId { get; set; } = 0;

    public bool IsBlock { get; set; } = false;

    public IEnumerable<long> HiddenMessageIds { get; set; } = [];

    public ConversationInfo(Conversation conversation, Guid userId)
    {
        Type = conversation.Type;
        ConversationId = conversation.ConversationId;
        var member = conversation.Members.Single(m => m.UserId == userId);
        Messages = conversation.Messages.Where(m => m.MessageId >= member.LoadFromId).OrderBy(m => m.MessageId).ToArray();
        var lastMessageId = conversation.Messages.Count != 0 ? conversation.Messages.Max(m => m.MessageId) : 0;
        Status = member.SeenToId >= lastMessageId
            ? MessageStatus.Seen
            : member.ReceivedToId >= lastMessageId ? MessageStatus.Received : MessageStatus.Sent;
        IsHidden = member.IsHidden;
        ReceivedToId = member.ReceivedToId;
        SeenToId = member.SeenToId;
        LoadFromId = member.LoadFromId;
        IsBlock = member.IsBlock;
        HiddenMessageIds = member.HiddenMessageIds;
    }
}
