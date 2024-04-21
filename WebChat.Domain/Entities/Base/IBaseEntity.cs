namespace WebChat.Domain.Entities.Base;

public interface IAggregateRoot
{
    IReadOnlyCollection<BaseEvent> DomainEvents { get; }
    void ClearDomainEvents();
}

public interface IBaseEntity<TKey>
{
    TKey GetId();
}

public interface IBaseEntity : IBaseEntity<Guid> { }

public interface IAuditableEntity
{
    DateTimeOffset Created { get; set; }

    string? CreatedBy { get; set; }

    DateTimeOffset LastModified { get; set; }

    string? LastModifiedBy { get; set; }
}

public interface IDeleteEntity
{
    bool IsDeleted { get; set; }
}
