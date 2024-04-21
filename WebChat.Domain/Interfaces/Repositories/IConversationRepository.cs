namespace WebChat.Domain.Interfaces.Repositories;

public interface IConversationRepository : IRepository<Conversation>
{
    #region Read Conversation
    Task<Conversation> GetWithoutMessagesAsync(Guid conversationId, CancellationToken cancellationToken = default);
    Task<Conversation> GetWithLastMessagesAsync(Guid conversationId, CancellationToken cancellationToken = default);
    Task<Conversation> GetAsync(Guid conversationId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Conversation>> GetListOfUserAsync(Guid userId, CancellationToken cancellationToken = default);
    #endregion

    #region Write Conversation
    Task AddAsync(Conversation entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(Conversation conversation, CancellationToken cancellationToken = default);
    #endregion

    #region Member Management
    Task AddMember(Conversation conversation, Guid memberId, CancellationToken cancellationToken = default);
    Task UpdateMember(Conversation conversation, Guid memberId, CancellationToken cancellationToken = default);
    Task DeleteMember(Conversation conversation, ConversationMember member, CancellationToken cancellationToken = default);
    #endregion

    #region Message Management
    Task<Message> GetMessageAsync(long messageId, CancellationToken cancellationToken = default);
    // Get count of messages from messageId of conversationId
    Task<IEnumerable<Message>> GetMessageListAsync(Guid conversationId, long fromMaxMessageId, long toMinMessageId, int count, CancellationToken cancellationToken = default);
    Task AddMessageAsync(Conversation conversation, long messageId, CancellationToken cancellationToken = default);
    Task UpdateMessageStatusAsync(Conversation conversation, long messageId, CancellationToken cancellationToken = default);
    Task DeleteMessageAsync(Conversation conversation, long messageId, CancellationToken cancellationToken = default);
    #endregion
}
