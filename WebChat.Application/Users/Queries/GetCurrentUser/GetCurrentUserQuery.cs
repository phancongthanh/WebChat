namespace WebChat.Application.Users.Queries.GetCurrentUser;

[Authorize]
public record GetCurrentUserQuery : IRequest<User> { }

public class GetUserCurrentQueryHandler(IUserRepository userRepository, IUser currentUser)
        : IRequestHandler<GetCurrentUserQuery, User>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUser _currentUser = currentUser;

    public async Task<User> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.GetId();
        var user = await _userRepository.GetAsync(userId, cancellationToken);

        return user;
    }
}
