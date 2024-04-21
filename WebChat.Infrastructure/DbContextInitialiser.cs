using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WebChat.Domain.Entities;
using WebChat.Domain.Enums;
using WebChat.Domain.ValueObjects;
using WebChat.Persistence.Contexts;

namespace WebChat.Infrastructure;
public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<DbContextInitialiser>();

        await initialiser.InitialiseAsync();

        await initialiser.SeedAsync();
    }
}

public class DbContextInitialiser(
    ILogger<DbContextInitialiser> logger,
    ApplicationDbContext context,
    AppIdentityDbContext appIdentityDbContext,
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<Guid>> roleManager)
{

    public async Task InitialiseAsync()
    {
        try
        {
            if (!context.Database.IsInMemory())
                await context.Database.MigrateAsync();
            if (!appIdentityDbContext.Database.IsInMemory())
                await appIdentityDbContext.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // Default
        var adminPhone = PhoneNumber.From("84", "0382441609");
        var password = "Test@123";
        var groupName = "WebChat";
        var groupCode = "WebChat";
        // Default roles
        if (roleManager.Roles.All(r => r.Name != Roles.Administrator))
        {
            var administratorRole = new IdentityRole<Guid>(Roles.Administrator);
            await roleManager.CreateAsync(administratorRole);
        }
        // Default users
        if (!context.Users.Any())
        {
            var users = new List<User>() {
                new(){
                    UserId = Guid.NewGuid(),
                    Name = "Administrator",
                    Birthday = new DateTime(2002, 09, 16, 0, 0, 0, DateTimeKind.Local),
                    Gender = Gender.Male,
                    PhoneNumber = adminPhone,
                    ConversationId = Guid.NewGuid(),
                },
                new() {
                    UserId = Guid.NewGuid(),
                    PhoneNumber = PhoneNumber.From("84", "123456789"),
                    ConversationId = Guid.NewGuid(),
                    Name = "Test User A",
                    Birthday = DateTime.UtcNow.AddYears(-20),
                    Gender = Gender.Male,
                },
                new() {
                    UserId = Guid.NewGuid(),
                    PhoneNumber = PhoneNumber.From("84", "987654321"),
                    ConversationId = Guid.NewGuid(),
                    Name = "Test User B",
                    Birthday = DateTime.UtcNow.AddYears(-20),
                    Gender = Gender.Male,
                }
            };
            foreach (var user in users)
            {
                // Create application user
                var phone = user.PhoneNumber.ToString();
                var admin = new ApplicationUser { UserName = phone, PhoneNumber = phone };
                await userManager.CreateAsync(admin, password);
                if (adminPhone == user.PhoneNumber)
                    await userManager.AddToRoleAsync(admin, Roles.Administrator);
                user.UserId = admin.Id;
                // Create cloud conversation
                var conversationId = Guid.NewGuid();
                var conversation = new Conversation()
                {
                    Type = ConversationType.Cloud,
                    ConversationId = conversationId
                };
                user.ConversationId = conversationId;
                var member = new ConversationMember()
                {
                    ConversationId = conversationId,
                    UserId = user.UserId,
                };
                conversation.Members.Add(member);
                // Update data
                context.Conversations.Add(conversation);
                context.Users.Add(user);
            }
            await context.SaveChangesAsync();
        }
        // Default friends
        if (!context.Friendships.Any())
        {
            var users = await context.Users.ToListAsync();
            var admin = users.Where(u => u.PhoneNumber == adminPhone).Single();
            users.Remove(admin);
            foreach (var user in users)
            {
                // Create friend conversation
                var conversationId = Guid.NewGuid();
                var conversation = new Conversation()
                {
                    Type = ConversationType.Friend,
                    ConversationId = conversationId
                };
                conversation.Members.Add(new ConversationMember()
                {
                    ConversationId = conversationId,
                    UserId = admin.UserId,
                });
                conversation.Members.Add(new ConversationMember()
                {
                    ConversationId = conversationId,
                    UserId = user.UserId,
                });
                // Create friendship
                var friendships = new[] {
                    new Friendship()
                    {
                        UserId = admin.UserId,
                        FriendId = user.UserId,
                        FriendPhone = user.PhoneNumber,
                        ConversationId = conversation.ConversationId,
                        IsFriend = true
                    },
                    new Friendship()
                    {
                        UserId = user.UserId,
                        FriendId = admin.UserId,
                        ConversationId = conversation.ConversationId,
                        IsFriend = true
                    }
                };
                // Update data
                context.Conversations.Add(conversation);
                context.Friendships.AddRange(friendships);
            }
            await context.SaveChangesAsync();
        }
        // Default group
        if (!context.Groups.Any())
        {
            var admin = await context.Users
                .Where(u => u.PhoneNumber.CountryCode == adminPhone.CountryCode
                    && u.PhoneNumber.SubscriberNumber == adminPhone.SubscriberNumber)
                .SingleAsync();
            var memberIds = await context.Friendships
                .Where(f => f.UserId == admin.UserId)
                .Select(f => f.FriendId)
                .ToListAsync();
            // Create group conversation
            var conversationId = Guid.NewGuid();
            var conversation = new Conversation()
            {
                Type = ConversationType.Group,
                ConversationId = conversationId
            };
            conversation.Members.Add(new ConversationMember() { UserId = admin.UserId });
            foreach (var memberId in memberIds)
                conversation.Members.Add(new ConversationMember() { UserId = memberId });
            // Create group
            var groupId = Guid.NewGuid();
            var group = new Group()
            {
                GroupId = groupId,
                Name = groupName,
                ConversationId = conversationId
            };
            group.Setting.GroupCode = groupCode;
            group.Members.Add(new GroupMember() { Role = MemberRole.Leader, UserId = admin.UserId });
            foreach (var memberId in memberIds)
                group.Members.Add(new GroupMember() { Role = MemberRole.Member, UserId = memberId });
            //Update data
            context.Conversations.Add(conversation);
            context.Groups.Add(group);
            await context.SaveChangesAsync();
        }
    }
}
