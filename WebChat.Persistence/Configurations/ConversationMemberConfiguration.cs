using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebChat.Persistence.Configurations;
public class ConversationMemberConfiguration : IEntityTypeConfiguration<ConversationMember>
{
    public void Configure(EntityTypeBuilder<ConversationMember> builder)
    {
        builder.ToTable(nameof(ConversationMember))
            .HasKey(c => new { c.ConversationId, c.UserId });

        builder.HasOne<User>().WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        //builder.HasOne<Conversation>().WithMany()
        //    .HasForeignKey(x => x.ConversationId)
        //    .OnDelete(DeleteBehavior.Cascade);
    }
}
