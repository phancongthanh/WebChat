namespace WebChat.Application.Groups.Queries.GetGroupsOfUser;

[Authorize]
public record GetGroupsOfUserQuery : IRequest<IEnumerable<Group>>, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
}

public class GetGroupsOfUserQueryHandler(IGroupRepository repository)
    : IRequestHandler<GetGroupsOfUserQuery, IEnumerable<Group>>
{
    public async Task<IEnumerable<Group>> Handle(GetGroupsOfUserQuery request, CancellationToken cancellationToken)
    {
        var groups = await repository
            .GetListOfUserAsync(request.CurrentUserId, cancellationToken);

        return groups;
    }
}
