namespace WebChat.Domain.Interfaces.Repositories;

public interface IGroupRepository : IRepository<Group>
{
    #region Read
    Task<Group> GetAsync(Guid id, CancellationToken cancellationToken = default);
    public Task<Group> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<IEnumerable<Group>> GetListOfUserAsync(Guid userId, CancellationToken cancellationToken = default);
    #endregion

    #region Write
    Task AddAsync(Group entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(Group entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(Group group, CancellationToken cancellationToken = default); 
    #endregion
}
