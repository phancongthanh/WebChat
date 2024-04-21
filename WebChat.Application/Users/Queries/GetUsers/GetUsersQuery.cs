using WebChat.Application.Common.Models;

namespace WebChat.Application.Users.Queries.GetUsers;
public record GetUsersQuery : IRequest<IEnumerable<UserInfo>>
{
    public required IEnumerable<Guid> UserIds { get; init; }
}

public class GetUsersQueryHandler(
    IUserRepository userRepository,
    IFriendRepository friendRepository,
    IUser currentUser
    )
    : IRequestHandler<GetUsersQuery, IEnumerable<UserInfo>>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IFriendRepository _friendRepository = friendRepository;
    private readonly IUser _currentUser = currentUser;

    public async Task<IEnumerable<UserInfo>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetListAsync(request.UserIds, cancellationToken);
        if (_currentUser.Id == null)
            return users.Select(u => new UserInfo(u)).ToList();

        var currentUserId = (Guid)_currentUser.Id;
        var friendships = await _friendRepository
            .GetListOfUserAsync(currentUserId, cancellationToken);

        // Preparing data
        var dtos = new List<UserInfo>();
        foreach (var user in users)
        {
            var fsOfUser = friendships
                .Where(f => f.FriendId == user.UserId)
                .SingleOrDefault();
            var fsOfFriend = friendships
                .Where(f => f.UserId == user.UserId)
                .SingleOrDefault();
            var friendInfo = new UserInfo(user, fsOfUser, fsOfFriend);
            dtos.Add(friendInfo);
        }

        // return dtos
        return dtos;
    }
}
