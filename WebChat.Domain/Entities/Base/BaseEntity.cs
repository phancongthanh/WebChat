using System.ComponentModel.DataAnnotations.Schema;

namespace WebChat.Domain.Entities.Base;

public abstract class BaseEntity<TKey> : IBaseEntity<TKey>
{
    public abstract TKey GetId();

    private readonly List<BaseEvent> _domainEvents = new();

    [NotMapped]
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void RemoveDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

public abstract class AuditableEntity<TKey> : BaseEntity<TKey>, IAuditableEntity
{
    public DateTimeOffset Created { get; set; }
    public string? CreatedBy { get; set; }
    public DateTimeOffset LastModified { get; set; }
    public string? LastModifiedBy { get; set; }
}

public abstract class DeleteEntity<TKey> : AuditableEntity<TKey>, IDeleteEntity
{
    public bool IsDeleted { get; set; } = false;
}


public abstract class BaseEntity : BaseEntity<Guid>, IBaseEntity { }
public abstract class AuditableEntity : AuditableEntity<Guid> { }
public abstract class DeleteEntity : DeleteEntity<Guid> { }
