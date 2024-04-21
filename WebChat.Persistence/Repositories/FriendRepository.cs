using Microsoft.EntityFrameworkCore;
using WebChat.Application.Common.Resources;
using WebChat.Domain.Interfaces.Repositories;
using WebChat.Persistence.Contexts;

namespace WebChat.Persistence.Repositories;
internal class FriendRepository(ApplicationDbContext context) : IFriendRepository
{
    #region ReadRepository
    public async Task<Friendship> GetAsync(Guid userId, Guid friendId, CancellationToken cancellationToken = default)
    {
        var entity = await context.Friendships.AsNoTracking()
            .Where(f => f.UserId == userId && f.FriendId == friendId)
            .FirstOrDefaultAsync(cancellationToken);

        entity = Guard.Against.NotFound(friendId, entity, FriendResource.Friendship);

        return entity;
    }

    public async Task<Friendship?> FindAsync(Guid userId, Guid friendId, CancellationToken cancellationToken = default)
    {
        var entity = await context.Friendships.AsNoTracking()
            .Where(f => f.UserId == userId && f.FriendId == friendId)
            .FirstOrDefaultAsync(cancellationToken);
        return entity;
    }
    #endregion

    #region WriteRepository
    public async Task AddAsync(Friendship entity, CancellationToken cancellationToken = default)
    {
        await context.Friendships.AddAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Friendship entity, CancellationToken cancellationToken = default)
    {
        var request = entity.Request;
        entity.Request = new() { };
        context.Update(entity);
        entity.Request = request;
        await context.SaveChangesAsync(cancellationToken);
    }
    #endregion

    #region FriendRepository
    public async Task<IEnumerable<Friendship>> GetListOfUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var entities = await context.Friendships.AsNoTracking()
            .Where(f => f.UserId == userId || f.FriendId == userId)
            .ToListAsync(cancellationToken);
        return entities;
    }
    #endregion
}
