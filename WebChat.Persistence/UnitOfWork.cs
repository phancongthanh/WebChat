// Implement the interface for UnitOfWork
using WebChat.Persistence.Contexts;

namespace WebChat.Persistence;

public class UnitOfWork(ApplicationDbContext context) : IUnitOfWork
{
    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (context.Database.CurrentTransaction == null)
        {
            await context.Database.BeginTransactionAsync(cancellationToken);
        }
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
        if (context.Database.CurrentTransaction != null)
        {
            await context.Database.CommitTransactionAsync(cancellationToken);
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (context.Database.CurrentTransaction != null)
        {
            await context.Database.RollbackTransactionAsync(cancellationToken);
        }
    }
}
