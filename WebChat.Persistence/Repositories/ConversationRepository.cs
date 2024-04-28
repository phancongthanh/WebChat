using Microsoft.EntityFrameworkCore;
using WebChat.Application.Common.Resources;
using WebChat.Domain.Interfaces.Repositories;
using WebChat.Persistence.Contexts;

namespace WebChat.Persistence.Repositories;
internal class ConversationRepository(ApplicationDbContext context) : IConversationRepository
{
    #region ReadRepository
    public async Task<Conversation> GetWithoutMessagesAsync(Guid conversationId, CancellationToken cancellationToken = default)
    {
        var entity = await context.Conversations
            .Include(c => c.Members)
            .AsNoTracking()
            .Where(g => g.ConversationId == conversationId)
            .FirstOrDefaultAsync(cancellationToken);

        entity = Guard.Against.NotFound(conversationId, entity, ConversationResource.Conversation);

        return entity;
    }
    public async Task<Conversation> GetWithLastMessagesAsync(Guid conversationId, CancellationToken cancellationToken = default)
    {
        var entity = await context.Conversations
            .Include(c => c.Members)
            .AsNoTracking()
            .Where(g => g.ConversationId == conversationId)
            .FirstOrDefaultAsync(cancellationToken);

        entity = Guard.Against.NotFound(conversationId, entity, ConversationResource.Conversation);
        var lastMessage = await context.Messages.AsNoTracking()
            .OrderByDescending(m => m.MessageId)
            .Take(1)
            .FirstOrDefaultAsync(cancellationToken);
        if (lastMessage != null) entity.Messages.Add(lastMessage);

        return entity;
    }
    public async Task<Conversation> GetAsync(Guid conversationId, CancellationToken cancellationToken = default)
    {
        var entity = await context.Conversations
            .Include(c => c.Members)
            .Include(c => c.Messages.OrderByDescending(m => m.MessageId).Take(5))
            .AsNoTracking()
            .Where(g => g.ConversationId == conversationId)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken);

        entity = Guard.Against.NotFound(conversationId, entity, ConversationResource.Conversation);

        return entity;
    }
    public async Task<IEnumerable<Conversation>> GetListOfUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var conversations = await context.Conversations
            .Include(c => c.Members)
            .Include(c => c.Messages.OrderByDescending(m => m.MessageId).Take(5))
            .AsNoTracking()
            .Where(c => c.Members.Any(m => m.UserId == userId))
            .AsSplitQuery()
            .ToListAsync(cancellationToken);

        return conversations;
    }
    #endregion

    #region ConversationRepository
    public async Task AddAsync(Conversation entity, CancellationToken cancellationToken = default)
    {
        await context.Conversations.AddAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Conversation conversation, CancellationToken cancellationToken = default)
    {
        await context.Conversations
            .Include(c => c.Members)
            .Include(c => c.Messages)
            .Where(g => g.ConversationId == conversation.ConversationId)
            .ExecuteDeleteAsync(cancellationToken);
    }
    #endregion

    #region Member
    public async Task<ConversationMember?> FindMember(Guid conversationId, Guid memberId, CancellationToken cancellationToken = default)
    {
        var member = await context.ConversationMembers.AsNoTracking()
            .Where(m => m.ConversationId == conversationId && m.UserId == memberId)
            .FirstOrDefaultAsync(cancellationToken);
        return member;
    }

    public async Task AddMember(Conversation conversation, Guid memberId, CancellationToken cancellationToken = default)
    {
        if (context.Entry(conversation).State == EntityState.Detached)
            context.Attach(conversation);
        var member = conversation.Members.Where(m => m.UserId == memberId).Single();
        context.Entry(member).State = EntityState.Added;
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMember(Conversation conversation, Guid memberId, CancellationToken cancellationToken = default)
    {
        if (context.Entry(conversation).State == EntityState.Detached)
            context.Attach(conversation);
        var member = conversation.Members.Where(m => m.UserId == memberId).Single();
        context.Entry(member).State = EntityState.Modified;
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteMember(Conversation conversation, ConversationMember member, CancellationToken cancellationToken = default)
    {
        if (context.Entry(conversation).State == EntityState.Detached)
            context.Attach(conversation);
        context.Remove(member);
        await context.SaveChangesAsync(cancellationToken);
    }
    #endregion

    #region Message Management
    public async Task<Message> GetMessageAsync(long messageId, CancellationToken cancellationToken = default)
    {
        var message = await context.Messages.AsNoTracking()
            .Where(m => m.MessageId == messageId)
            .FirstOrDefaultAsync(cancellationToken);
        message = Guard.Against.NotFound(messageId, message, MessageResource.Message);

        return message;
    }
    // Get count of messages from messageId of conversationId
    public async Task<IEnumerable<Message>> GetMessageListAsync(Guid conversationId, long fromMaxMessageId, long toMinMessageId, int count, CancellationToken cancellationToken = default)
    {
        var messages = await context.Messages.AsNoTracking()
            .Where(m => m.ConversationId == conversationId)
            .Where(m => toMinMessageId < m.MessageId && m.MessageId < fromMaxMessageId)
            .OrderByDescending(m => m.MessageId)
            .Take(count)
            .ToListAsync(cancellationToken);

        return messages;
    }
    public async Task AddMessageAsync(Conversation conversation, long messageId, CancellationToken cancellationToken = default)
    {
        if (context.Entry(conversation).State == EntityState.Detached)
            context.Attach(conversation);
        var message = conversation.Messages.Where(m => m.MessageId == messageId).Single();
        context.Entry(message).State = EntityState.Added;
        foreach (var file in message.Files)
        {
            context.Entry(file).State = EntityState.Added;
        }
        await context.SaveChangesAsync(cancellationToken);
    }
    public async Task UpdateMessageStatusAsync(Conversation conversation, long messageId, CancellationToken cancellationToken = default)
    {
        if (context.Entry(conversation).State == EntityState.Detached)
            context.Attach(conversation);
        var message = conversation.Messages.Where(m => m.MessageId == messageId).Single();
        context.Entry(message).Property(m => m.Status).IsModified = true;
        await context.SaveChangesAsync(cancellationToken);
    }
    public async Task DeleteMessageAsync(Conversation conversation, long messageId, CancellationToken cancellationToken = default)
    {
        if (context.Entry(conversation).State == EntityState.Detached)
            context.Attach(conversation);
        var message = conversation.Messages.Where(m => m.MessageId == messageId).Single();
        context.Entry(message).Property(m => m.IsDeleted).IsModified = true;
        await context.SaveChangesAsync(cancellationToken);
    }
    #endregion
}
