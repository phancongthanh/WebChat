namespace WebChat.Domain.Entities;

public class User : AuditableEntity, IAggregateRoot
{
    public Guid UserId { get; set; } = Guid.Empty;

    public string? AvatarPath { get; set; } = default;

    public string Name { get; set; } = string.Empty;

    public DateTime Birthday { get; set; }

    public Gender Gender { get; set; } = Gender.NotKnown;

    public PhoneNumber PhoneNumber { get; set; } = PhoneNumber.Empty;

    public Guid ConversationId { get; set; } = Guid.Empty;

    public override Guid GetId() => UserId;
}
