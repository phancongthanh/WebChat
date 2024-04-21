using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.ValueObjects;

namespace WebChat.Persistence.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        // Table
        builder.ToTable(nameof(Message))
            .HasKey(x => x.MessageId);

        // Properties
        builder.Property(m => m.MessageId).ValueGeneratedOnAdd();

        // Indexes
        builder.HasIndex(x => x.ConversationId);
        builder.HasIndex(x => new { x.ConversationId, x.MessageId });

        // Foreign key
        builder.HasOne<User>().WithMany()
            .HasForeignKey(x => x.FromUserId)
            .OnDelete(DeleteBehavior.Cascade);

        //builder.HasOne<Conversation>()
        //    .WithMany()
        //    .HasForeignKey(x => x.ConversationId)
        //    .OnDelete(DeleteBehavior.Cascade);

        builder.OwnsMany(m => m.Files, files =>
        {
            files.ToTable(nameof(FileMetadata)).HasKey(f => f.Path);
            files.WithOwner().HasForeignKey();
        });
    }
}
