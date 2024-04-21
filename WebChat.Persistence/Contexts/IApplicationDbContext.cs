using Microsoft.EntityFrameworkCore;

namespace WebChat.Persistence.Contexts;
public interface IApplicationDbContext
{
    DbSet<User> Users { get; }

    DbSet<Friendship> Friendships { get; }

    DbSet<Group> Groups { get; }

    // Conversation
    DbSet<Conversation> Conversations { get; }

    DbSet<ConversationMember> ConversationMembers { get; }

    DbSet<Message> Messages { get; }
}
