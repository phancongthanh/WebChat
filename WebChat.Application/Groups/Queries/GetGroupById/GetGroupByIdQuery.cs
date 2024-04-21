namespace WebChat.Application.Groups.Queries.GetGroupById;
public record GetGroupByIdQuery : IRequest<Group>
{
    public Guid GroupId { get; init; }
}

public class GetGroupByIdQueryHandler(IGroupRepository repository)
    : IRequestHandler<GetGroupByIdQuery, Group>
{
    public async Task<Group> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
    {
        var group = await repository.GetAsync(request.GroupId, cancellationToken);
        return group;
    }
}
