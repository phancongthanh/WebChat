using WebChat.Application.Common.Models;

namespace WebChat.Application.Users.Queries.GetUser;

public record GetUserQuery : IRequest<UserInfo?>
{
    public Guid UserId { get; init; }
}

public class GetUserQueryHandler(
    IUserRepository userRepository,
    IFriendRepository friendRepository,
    IUser currentUser
    )
        : IRequestHandler<GetUserQuery, UserInfo?>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IFriendRepository _friendRepository = friendRepository;
    private readonly IUser _currentUser = currentUser;

    public async Task<UserInfo?> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FindAsync(request.UserId, cancellationToken);
        if (user == null) return null;
        if (_currentUser.Id is null) return new UserInfo(user);

        var currentUserId = (Guid)_currentUser.Id;
        if (currentUserId == request.UserId) return new UserInfo(user);

        var fsOfUser = await _friendRepository
            .FindAsync(currentUserId, request.UserId, cancellationToken);
        var fsOfFriend = await _friendRepository
            .FindAsync(request.UserId, currentUserId, cancellationToken);

        var dto = new UserInfo(user, fsOfUser, fsOfFriend);
        return dto;
    }
}
