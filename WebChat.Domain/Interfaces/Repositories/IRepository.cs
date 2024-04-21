namespace WebChat.Domain.Interfaces.Repositories;

public interface IRepository<TEntity> where TEntity : class, IAggregateRoot { }
