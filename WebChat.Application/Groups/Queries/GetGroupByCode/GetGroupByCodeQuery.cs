namespace WebChat.Application.Groups.Queries.GetGroupByCode;
public record GetGroupByCodeQuery : IRequest<Group>
{
    public required string GroupCode { get; init; }
}

public class GetGroupByCodeQueryHandler(IGroupRepository repository)
    : IRequestHandler<GetGroupByCodeQuery, Group>
{
    public async Task<Group> Handle(GetGroupByCodeQuery request, CancellationToken cancellationToken)
    {
        var group = await repository.GetByCodeAsync(request.GroupCode, cancellationToken);
        return group;
    }
}
