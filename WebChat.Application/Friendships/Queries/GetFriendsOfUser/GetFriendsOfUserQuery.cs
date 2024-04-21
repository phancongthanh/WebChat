using WebChat.Application.Common.Models;

namespace WebChat.Application.Friendships.Queries.GetFriendsOfUser;

[Authorize]
public record GetFriendsOfUserQuery : IRequest<IEnumerable<UserInfo>>, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
}

public class GetFriendsOfUserQueryHandler(IUserRepository userRepository, IFriendRepository friendRepository)
        : IRequestHandler<GetFriendsOfUserQuery, IEnumerable<UserInfo>>
{
    public async Task<IEnumerable<UserInfo>> Handle(GetFriendsOfUserQuery request, CancellationToken cancellationToken)
    {
        // Get data
        var friendships = await friendRepository
            .GetListOfUserAsync(request.CurrentUserId, cancellationToken);
        var friendIds = friendships
            .Select(f => f.UserId == request.CurrentUserId ? f.FriendId : f.UserId);
        var friends = await userRepository.GetListAsync(friendIds, cancellationToken);

        // Preparing data
        var dtos = new List<UserInfo>();
        foreach (var friend in friends)
        {
            var fsOfUser = friendships
                .Where(f => f.FriendId == friend.UserId)
                .Single();
            var fsOfFriend = friendships
                .Where(f => f.UserId == friend.UserId)
                .Single();
            var friendInfo = new UserInfo(friend, fsOfUser, fsOfFriend);
            dtos.Add(friendInfo);
        }

        return dtos;
    }
}
