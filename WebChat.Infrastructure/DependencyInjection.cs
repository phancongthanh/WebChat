using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebChat.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using WebChat.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;
using WebChat.Domain.Interfaces;

namespace WebChat.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddDistributedMemoryCache();

        services.AddOptions<SystemInfoOptions>()
            .Bind(configuration.GetSection(SystemInfoOptions.SectionName));
        services.AddTransient(sp => sp.GetRequiredService<IOptions<SystemInfoOptions>>().Value);

        services.AddOptions<FileStoreOptions>()
            .Bind(configuration.GetSection(FileStoreOptions.SectionName));
        services.AddTransient(sp => sp.GetRequiredService<IOptions<FileStoreOptions>>().Value);
        services.AddTransient<IFileStore, FileStore>();

        // Identity
        services.AddAppIdentity(configuration);
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddTransient<IAuthService, AuthService>();

        services.AddTransient<IImageProcessor, ImageProcessor>();

        services.AddScoped<DbContextInitialiser>();
        services.AddTransient<IMessageIdGenerator, MessageIdGenerator>();

        return services;
    }

    private static IServiceCollection AddAppIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppIdentityDbContext>((sp, options) =>
        {
            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
                options.UseInMemoryDatabase("WebChatServerDb");
            else
            {
                var connectionString = configuration.GetConnectionString("PostgreSQL");
                Guard.Against.Null(connectionString, message: "Connection string 'PostgreSQL' not found.");
                options.UseNpgsql(connectionString,
                    builder => builder.MigrationsAssembly(typeof(AppIdentityDbContext).Assembly.FullName));
            }
        }
        );

        services.AddDefaultIdentity<ApplicationUser>(
            options => options.User.AllowedUserNameCharacters = "0123456789+()")
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<AppIdentityDbContext>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            configuration.Bind("JwtSettings", options);
            var key = Encoding.UTF8.GetBytes(configuration["SecurityKey"]
                ?? throw new ArgumentNullException("SecurityKey"));
            options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(key);
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];

                    // If the request is for our hub...
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) &&
                        path.StartsWithSegments("/hub"))
                    {
                        // Read the token out of the query string
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.Authenticated,
                policy => policy
                .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser());
            var defaultPolicy = options.GetPolicy(Policies.Authenticated);
            if (defaultPolicy != null) options.DefaultPolicy = defaultPolicy;
        });

        return services;
    }
}
