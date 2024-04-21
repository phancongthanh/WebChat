using AutoMapper.Execution;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebChat.Persistence.Configurations;
public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        // Table
        builder.ToTable(nameof(Group))
            .HasKey(x => x.GroupId);

        // Properties
        builder.Ignore(g => g.NumberOfMembers);

        // Foreign key
        builder.HasOne<Conversation>().WithOne()
            .HasForeignKey<Group>(g => g.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.OwnsOne(g => g.Setting,
            setting =>
            {
                setting.ToTable(nameof(GroupSetting)).WithOwner();
                setting.HasIndex(s => s.GroupCode);
            });
        builder.OwnsMany(g => g.Members,
            members =>
            {
                members.ToTable(nameof(GroupMember))
                    .HasKey(m => new { m.GroupId, m.UserId });
                members.WithOwner()
                    .HasForeignKey(m => m.GroupId);
                members.HasOne<User>().WithMany()
                    .HasForeignKey(m => m.UserId);
                members.HasIndex(m => m.UserId);
            }
        );
        builder.OwnsMany(g => g.JoinRequests,
            joinRequests =>
            {
                joinRequests.ToTable(nameof(JoinRequest))
                    .HasKey(j => new { j.GroupId, j.UserId });
                joinRequests.WithOwner()
                    .HasForeignKey(j => j.GroupId);
                joinRequests.HasOne<User>().WithMany()
                    .HasForeignKey(m => m.UserId);
                joinRequests.HasIndex(m => m.UserId);
            }
        );
        builder.OwnsMany(g => g.JoinInvitations,
            joinInvitations =>
            {
                joinInvitations.ToTable(nameof(JoinInvitation))
                    .HasKey(j => new { j.GroupId, j.UserId });
                joinInvitations.WithOwner()
                    .HasForeignKey(j => j.GroupId);
                joinInvitations.HasOne<User>().WithMany()
                    .HasForeignKey(m => m.UserId);
                joinInvitations.HasIndex(m => m.UserId);
            }
        );
    }
}
