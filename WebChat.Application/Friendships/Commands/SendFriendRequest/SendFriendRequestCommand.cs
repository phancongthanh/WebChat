namespace WebChat.Application.Friendships.Commands.SendFriendRequest;

[Authorize]
public record SendFriendRequestCommand : IRequest, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
    public Guid FriendId { get; init; }
    public required string RequestTitle { get; init; }
    public required string Description { get; init; }
}

public class SendFriendRequestCommandHandler(
    IUserRepository userRepository,
    IFriendRepository friendRepository,
    IConversationRepository conversationRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<SendFriendRequestCommand>
{
    private async Task CreateFriendShip(SendFriendRequestCommand request, CancellationToken cancellationToken)
    {
        // Domain validation
        var users = await userRepository.GetListAsync([request.CurrentUserId, request.FriendId], cancellationToken);
        var user = users.SingleOrDefault(u => u.UserId == request.CurrentUserId);
        Guard.Against.NotFound(request.CurrentUserId, user, UserResource.User);
        var friend = users.SingleOrDefault(u => u.UserId == request.CurrentUserId);
        Guard.Against.NotFound(request.FriendId, friend, UserResource.User);


        // Create friend conversation
        var conversation = new Conversation()
        {
            Type = ConversationType.Friend,
            ConversationId = Guid.NewGuid()
        };
        conversation.Members.Add(new ConversationMember() { UserId = request.CurrentUserId });
        conversation.Members.Add(new ConversationMember() { UserId = request.FriendId });

        // Send request to make friend
        var friendRequest = new FriendRequest()
        {
            Title = request.RequestTitle,
            Description = request.Description,
            SendTime = DateTime.UtcNow
        };

        // Create friendship
        var fsOfUser = new Friendship()
        {
            UserId = request.CurrentUserId,
            FriendId = request.FriendId,
            ConversationId = conversation.ConversationId,
            Request = friendRequest
        };
        var fsOfFriend = new Friendship()
        {
            UserId = request.FriendId,
            FriendId = request.CurrentUserId,
            ConversationId = conversation.ConversationId
        };

        // Preparing domain event
        var domainEvent = new FriendRequestSendedEvent(request.CurrentUserId, request.FriendId, friendRequest);
        fsOfUser.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await conversationRepository.AddAsync(conversation, cancellationToken);
            await friendRepository.AddAsync(fsOfUser, cancellationToken);
            await friendRepository.AddAsync(fsOfFriend, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    public async Task Handle(SendFriendRequestCommand request, CancellationToken cancellationToken)
    {
        var fsOfUser = await friendRepository
            .FindAsync(request.CurrentUserId, request.FriendId, cancellationToken);
        var fsOfFriend = await friendRepository
            .FindAsync(request.FriendId, request.CurrentUserId, cancellationToken);

        // Create new friendship
        if (fsOfUser == null || fsOfFriend == null)
        {
            if (fsOfUser != null || fsOfFriend != null)
                throw new Exception();

            await CreateFriendShip(request, cancellationToken);
            return;
        }

        // Update data
        if (fsOfFriend.Request != null)
        {
            // Nếu friend cũng đã có Request => accept the request of friend
            fsOfUser.Request = null;
            fsOfUser.IsFriend = true;
            fsOfFriend.Request = null;
            fsOfFriend.IsFriend = true;
            // Hủy block
            fsOfUser.Blocked = false;
            fsOfFriend.Blocked = false;
            // Preparing domain event
            var domainEvent = new FriendRequestAcceptedEvent(
                request.CurrentUserId, request.FriendId);
            fsOfUser.AddDomainEvent(domainEvent);

            // Save data
            try
            {
                await unitOfWork.BeginTransactionAsync(cancellationToken);
                await friendRepository.UpdateAsync(fsOfUser, cancellationToken);
                await friendRepository.UpdateAsync(fsOfFriend, cancellationToken);
                await unitOfWork.CommitTransactionAsync(cancellationToken);
            }
            catch (Exception)
            {
                await unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }
        else
        {
            // Send request to make friend
            var friendRequest = new FriendRequest()
            {
                Title = request.RequestTitle,
                Description = request.Description,
                SendTime = DateTime.UtcNow
            };
            fsOfUser.Request = friendRequest;
            // Hủy block
            fsOfUser.Blocked = false;
            // Preparing domain event
            var domainEvent = new FriendRequestSendedEvent(
                request.CurrentUserId, request.FriendId, friendRequest);
            fsOfUser.AddDomainEvent(domainEvent);

            // Save data
            await friendRepository.UpdateAsync(fsOfUser, cancellationToken);
        }
    }
}
