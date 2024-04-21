using WebChat.Domain.Events.Conversations;

namespace WebChat.Application.Friendships.Commands.UpdateFriendInfo;

[Authorize]
public record UpdateFriendInfoCommand : IRequest, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
    public Guid FriendId { get; init; }
    public string? FriendAlias { get; init; }
    public bool IsBlock { get; init; }
}

public class UpdateFriendCommandHandler(
    IUserRepository userRepository,
    IFriendRepository friendRepository,
    IConversationRepository conversationRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateFriendInfoCommand>
{
    private async Task CreateFriendShip(UpdateFriendInfoCommand request, CancellationToken cancellationToken)
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
        conversation.Members.Add(new ConversationMember() { UserId = request.CurrentUserId, IsBlock = request.IsBlock });
        conversation.Members.Add(new ConversationMember() { UserId = request.FriendId });

        // Create friendship
        var fsOfUser = new Friendship()
        {
            UserId = request.CurrentUserId,
            FriendId = request.FriendId,
            ConversationId = conversation.ConversationId,
            FriendAlias = request.FriendAlias,
            Blocked = request.IsBlock
        };
        var fsOfFriend = new Friendship()
        {
            UserId = request.FriendId,
            FriendId = request.CurrentUserId,
            ConversationId = conversation.ConversationId
        };

        // Preparing domain event
        var domainEvent = new FriendInfoUpdatedEvent(fsOfUser);
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

    public async Task Handle(UpdateFriendInfoCommand request, CancellationToken cancellationToken)
    {
        var friendship = await friendRepository.FindAsync(request.CurrentUserId, request.FriendId, cancellationToken);

        if (friendship != null)
        {
            // Update data
            friendship.FriendAlias = request.FriendAlias;
            if (friendship.Blocked != request.IsBlock)
            {
                friendship.Blocked = request.IsBlock;
                var conversation = await conversationRepository.GetAsync(friendship.ConversationId, cancellationToken);
                var member = conversation.Members.Where(m => m.UserId == friendship.FriendId).Single();
                member.IsBlock = request.IsBlock;

                // Preparing domain event
                friendship.AddDomainEvent(new FriendInfoUpdatedEvent(friendship));
                conversation.AddDomainEvent(new ConversationMemberUpdatedEvent(member));

                // Save data
                try
                {
                    await unitOfWork.BeginTransactionAsync(cancellationToken);
                    await conversationRepository.UpdateMember(conversation, member.UserId, cancellationToken);
                    await friendRepository.UpdateAsync(friendship, cancellationToken);
                    await unitOfWork.CommitTransactionAsync(cancellationToken);
                } catch (Exception)
                {
                    await unitOfWork.RollbackTransactionAsync(cancellationToken);
                    throw;
                }
            }
            else
            {
                // Preparing domain event
                var domainEvent = new FriendInfoUpdatedEvent(friendship);
                friendship.AddDomainEvent(domainEvent);

                // Save data
                await friendRepository.UpdateAsync(friendship, cancellationToken);
            }
        }
        else
        {
            await CreateFriendShip(request, cancellationToken);
        }
    }
}
