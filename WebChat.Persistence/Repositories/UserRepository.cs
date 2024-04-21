using Microsoft.EntityFrameworkCore;
using WebChat.Application.Common.Resources;
using WebChat.Domain.Interfaces.Repositories;
using WebChat.Domain.ValueObjects;
using WebChat.Persistence.Contexts;

namespace WebChat.Persistence.Repositories;
public class UserRepository(ApplicationDbContext context) : IUserRepository
{
    #region ReadRepository
    public async Task<IEnumerable<User>> GetListAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        var entities = await context.Users.AsNoTracking()
            .Where(u => ids.Contains(u.UserId))
            .ToListAsync(cancellationToken);
        return entities;
    }

    public async Task<User> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await context.Users.AsNoTracking()
            .Where(u => u.UserId == id)
            .FirstOrDefaultAsync(cancellationToken);

        entity = Guard.Against.NotFound(id, entity, UserResource.User);

        return entity;
    }

    public async Task<User?> FindAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await context.Users.AsNoTracking()
            .Where(u => u.UserId == id)
            .FirstOrDefaultAsync(cancellationToken);
        return entity;
    }
    #endregion

    #region WriteRepository
    public async Task AddAsync(User entity, CancellationToken cancellationToken = default)
    {
        await context.Users.AddAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(User entity, CancellationToken cancellationToken = default)
    {
        context.Update(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
    #endregion

    #region IUserRepository
    public async Task<User?> FindByPhoneAsync(PhoneNumber phoneNumber, CancellationToken cancellationToken = default)
    {
        var entity = await context.Users.AsNoTracking()
            .Where(u => u.PhoneNumber.CountryCode == phoneNumber.CountryCode && u.PhoneNumber.SubscriberNumber == phoneNumber.SubscriberNumber)
            .FirstOrDefaultAsync(cancellationToken);
        return entity;
    }
    #endregion
}
