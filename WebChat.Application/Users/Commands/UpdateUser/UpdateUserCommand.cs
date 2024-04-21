namespace WebChat.Application.Users.Commands.UpdateUser;

[Authorize]
public record UpdateUserCommand : IRequest, ICurrentUser
{
    public Guid CurrentUserId { get; init; }

    public required string Name { get; init; }

    public DateTimeOffset Birthday { get; init; }

    public Gender Gender { get; init; }
}

public class UpdateUserCommandHandler(IUserRepository repository)
    : IRequestHandler<UpdateUserCommand>
{
    public async Task Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await repository.GetAsync(request.CurrentUserId, cancellationToken);

        // Update data
        user.Name = request.Name;
        user.Birthday = request.Birthday.UtcDateTime;
        user.Gender = request.Gender;

        // Save data
        await repository.UpdateAsync(user, cancellationToken);
    }
}
