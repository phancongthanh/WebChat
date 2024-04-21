using WebChat.Application.Common.Models;

namespace WebChat.Application.Users.Queries.GetUserByPhone;
public record GetUserByPhoneQuery : IRequest<UserInfo?>
{
    public required string CountryCode { get; init; }

    public required string PhoneNumber { get; init; }
}

public class GetUserByPhoneQueryHandler(
    IUserRepository userRepository,
    IFriendRepository friendRepository,
    IUser user
    )
    : IRequestHandler<GetUserByPhoneQuery, UserInfo?>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IFriendRepository _friendRepository = friendRepository;
    private readonly IUser _currentUser = user;

    public async Task<UserInfo?> Handle(GetUserByPhoneQuery request, CancellationToken cancellationToken)
    {
        var phone = PhoneNumber.From(request.CountryCode, request.PhoneNumber);
        var user = await _userRepository.FindByPhoneAsync(phone, cancellationToken);
        if (user == null) return null;
        if (_currentUser.Id is null) return new UserInfo(user);

        var currentUserId = (Guid)_currentUser.Id;

        var fsOfUser = await _friendRepository
            .FindAsync(currentUserId, user.UserId, cancellationToken);
        var fsOfFriend = await _friendRepository
            .FindAsync(user.UserId, currentUserId, cancellationToken);

        return new UserInfo(user, fsOfUser, fsOfFriend);
    }
}
