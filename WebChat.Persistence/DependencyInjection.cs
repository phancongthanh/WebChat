using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Diagnostics;
using WebChat.Domain.Interfaces.Repositories;
using Microsoft.Extensions.DependencyInjection;
using WebChat.Persistence.Contexts;
using WebChat.Persistence.Interceptors;
using WebChat.Persistence.Repositories;

namespace WebChat.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());

            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                options.UseInMemoryDatabase("WebChatServerDb");
                options.ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning));
            }
            else
            {
                var connectionString = configuration.GetConnectionString("PostgreSQL");
                Guard.Against.Null(connectionString, message: "Connection string 'PostgreSQL' not found.");
                options.UseNpgsql(connectionString,
                    builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
            }
        }
        );
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        // Repositories
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddScoped<IFriendRepository, FriendRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        return services;
    }
}
