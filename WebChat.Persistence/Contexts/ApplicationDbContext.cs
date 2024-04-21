using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace WebChat.Persistence.Contexts;
public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();

    public DbSet<Friendship> Friendships => Set<Friendship>();

    public DbSet<Group> Groups => Set<Group>();

    // Conversation
    public DbSet<Conversation> Conversations => Set<Conversation>();

    public DbSet<ConversationMember> ConversationMembers => Set<ConversationMember>();

    public DbSet<Message> Messages => Set<Message>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema("Default");
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        builder.ConfigureWarnings(w => w.Throw(RelationalEventId.MultipleCollectionIncludeWarning));
        base.OnConfiguring(builder);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder
            .Properties<DateTime>()
            .HaveConversion<UtcDateTimeConverter>();
    }
}

/// <summary>
/// https://github.com/dotnet/efcore/issues/4711#issuecomment-1251961473
/// </summary>
internal class UtcDateTimeConverter : ValueConverter<DateTime?, DateTime?>
{
    public UtcDateTimeConverter()
        : base(
            d => !d.HasValue ? null : ConvertToUtc(d.Value),
            d => !d.HasValue ? null : SpecifyUtc(d.Value))
    {
    }

    private static DateTime ConvertToUtc(DateTime date)
    {
        return date.Kind switch
        {
            DateTimeKind.Utc => date,
            DateTimeKind.Local => date.ToUniversalTime(),
            _ => throw new InvalidTimeZoneException($"Unsupported DateTimeKind: {date.Kind}"),
        };
    }

    private static DateTime SpecifyUtc(DateTime date)
    {
        return DateTime.SpecifyKind(date, DateTimeKind.Utc);
    }
}
