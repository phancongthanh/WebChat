using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebChat.Persistence.Configurations;
public class FriendConfiguration : IEntityTypeConfiguration<Friendship>
{
    public void Configure(EntityTypeBuilder<Friendship> builder)
    {
        // Table
        builder.ToTable(nameof(Friendship))
            .HasKey(x => new { x.UserId, x.FriendId });
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.FriendId);

        // Properties
        builder.OwnsOne(f => f.FriendPhone).WithOwner();
        builder.OwnsOne(f => f.Request).WithOwner();

        // Foreign key
        builder.HasOne<User>().WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<User>().WithMany()
            .HasForeignKey(x => x.FriendId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Conversation>().WithMany()
            .HasForeignKey(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
