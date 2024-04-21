using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebChat.Persistence.Configurations;
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Table
        builder.ToTable(nameof(User)).HasKey(x => x.UserId);

        // Properties
        builder.OwnsOne(u => u.PhoneNumber);

        // Foreign key
        builder.HasOne<Conversation>().WithOne()
            .HasForeignKey<User>(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
