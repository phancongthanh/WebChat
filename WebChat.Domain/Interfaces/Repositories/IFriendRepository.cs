namespace WebChat.Domain.Interfaces.Repositories;
public interface IFriendRepository : IRepository<Friendship>
{
    #region Read
    Task<Friendship> GetAsync(Guid userId, Guid friendId, CancellationToken cancellationToken = default);
    Task<Friendship?> FindAsync(Guid userId, Guid friendId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Friendship>> GetListOfUserAsync(Guid userId, CancellationToken cancellationToken = default);
    #endregion

    #region Write
    Task AddAsync(Friendship entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(Friendship entity, CancellationToken cancellationToken = default);
    #endregion
}
