using WebChat.Application.Common.Interfaces;
using WebChat.Domain.Entities;

namespace WebChat.Application.Users.Commands.CreateUser;

public record CreateUserCommand : IRequest
{
    public Guid UserId { get; init; } = Guid.Empty;

    public string CountryCode { get; init; } = string.Empty;

    public string PhoneNumber { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;

    public DateTimeOffset Birthday { get; init; }

    public Gender Gender { get; init; }
}

public class CreateUserCommandHandler(IUnitOfWork unitOfWork,
    IUserRepository userRepository,
    IConversationRepository conversationRepository)
    : IRequestHandler<CreateUserCommand>
{
    public async Task Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Preparing data
        var phoneNumber = PhoneNumber.From(request.CountryCode, request.PhoneNumber);
        var existedUser = await userRepository.FindByPhoneAsync(phoneNumber, cancellationToken);

        // Domain validate
        if (existedUser != null)
            throw new ConflictException(UserResource.User, phoneNumber.ToString())
                .WithDetail(UserResource.UserAlreadyExists)
                .WithCode(nameof(UserResource.UserAlreadyExists));

        // Create cloud conversation
        var conversationId = Guid.NewGuid();
        var conversation = new Conversation()
        {
            Type = ConversationType.Cloud,
            ConversationId = conversationId
        };
        var member = new ConversationMember()
        {
            ConversationId = conversationId,
            UserId = request.UserId,
        };

        // Create user
        var user = new User()
        {
            UserId = request.UserId,
            Name = request.Name,
            Birthday = request.Birthday.UtcDateTime,
            Gender = request.Gender,
            PhoneNumber = PhoneNumber.From(request.CountryCode, request.PhoneNumber),
            ConversationId = conversationId,
        };

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await conversationRepository.AddAsync(conversation, cancellationToken);
            await userRepository.AddAsync(user, cancellationToken);
            conversation.Members.Add(member);
            await conversationRepository.AddMember(conversation, member.UserId, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}
