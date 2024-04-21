using Microsoft.EntityFrameworkCore;
using WebChat.Application.Common.Resources;
using WebChat.Domain.Interfaces.Repositories;
using WebChat.Persistence.Contexts;

namespace WebChat.Persistence.Repositories;
internal class GroupRepository(ApplicationDbContext context) : IGroupRepository
{
    #region ReadRepository
    public async Task<Group> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await context.Groups
            .Where(g => g.GroupId == id)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken);

        entity = Guard.Against.NotFound(id, entity, GroupResource.Group);

        return entity;
    }
    #endregion

    #region WriteRepository
    public async Task AddAsync(Group entity, CancellationToken cancellationToken = default)
    {
        await context.Groups.AddAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Group entity, CancellationToken cancellationToken = default)
    {
        if (context.Entry(entity).State == EntityState.Detached) context.Update(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
    #endregion

    #region GroupRepository
    public async Task<Group> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        var entity = await context.Groups
            .Where(g => g.Setting.GroupCode == code)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken);

        entity = Guard.Against.NotFound(code, entity, GroupResource.Group);

        return entity;
    }

    public async Task<IEnumerable<Group>> GetListOfUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var groups = context.Groups;

        var memberGroups = await groups
            .Where(g => g.Members.Any(m => m.UserId == userId))
            .AsSplitQuery()
            .ToListAsync(cancellationToken);

        var joinRequestGroups = await groups
            .Where(g => g.JoinRequests.Any(m => m.UserId == userId))
            .AsSplitQuery()
            .ToListAsync(cancellationToken);

        var joinInvitationGroups = await groups
            .Where(g => g.JoinInvitations.Any(m => m.UserId == userId))
            .AsSplitQuery()
            .ToListAsync(cancellationToken);

        var entities = memberGroups
            .Union(joinRequestGroups)
            .Union(joinInvitationGroups)
            .DistinctBy(g => g.GroupId);

        return entities;
    }
    public async Task DeleteAsync(Group group, CancellationToken cancellationToken = default)
    {
        context.Groups.Remove(group);
        await context.SaveChangesAsync(cancellationToken);
    }
    #endregion
}
