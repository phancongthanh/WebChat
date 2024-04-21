namespace WebChat.Domain.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    #region Read
    Task<IEnumerable<User>> GetListAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default);
    Task<User> GetAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> FindAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> FindByPhoneAsync(PhoneNumber phoneNumber, CancellationToken cancellationToken = default);
    #endregion

    #region Write
    Task AddAsync(User entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(User entity, CancellationToken cancellationToken = default); 
    #endregion
}
