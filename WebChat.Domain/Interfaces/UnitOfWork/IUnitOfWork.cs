namespace WebChat.Domain.Interfaces.UnitOfWork;

// Define the interface for UnitOfWork
public interface IUnitOfWork
{
    // Begin a new transaction
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    // Commit the current transaction
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    // Rollback the current transaction
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
