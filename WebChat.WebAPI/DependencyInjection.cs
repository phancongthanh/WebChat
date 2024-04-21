using System.Text.Json.Serialization;
using WebChat.Application.Common.Interfaces;
using WebChat.WebAPI.Middlewares;
using WebChat.WebAPI.Services;
using MicroElements.Swashbuckle.FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Any;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebChat.Domain.Constants;
using WebChat.Persistence.Contexts;
using Microsoft.AspNetCore.Http.Extensions;

namespace WebChat.WebAPI;
public static class DependencyInjection
{
    public static IServiceCollection AddWebAPIServices(this IServiceCollection services)
    {
        services.AddDatabaseDeveloperPageExceptionFilter();
        services.AddHttpLogging(o => { });

        services.AddHttpContextAccessor();
        services.AddScoped<IUser, CurrentUser>();

        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>();
        services.AddMiniProfiler(options => options.RouteBasePath = "/profiler")
            .AddEntityFramework();

        services.AddProblemDetails(options => options.CustomizeProblemDetails = ctx =>
        {
            ctx.ProblemDetails.Extensions.Add(ErrorConstants.TraceId, ctx.HttpContext.TraceIdentifier);
            ctx.ProblemDetails.Instance = ctx.HttpContext.Request.GetEncodedUrl();
            if (ctx.Exception != null)
            {
                var errorCode = ctx.Exception.Data[ErrorConstants.Code];
                ctx.ProblemDetails.Extensions.Add(ErrorConstants.Code, errorCode);
                var message = ctx.Exception.Message;
                ctx.ProblemDetails.Extensions.Add(ErrorConstants.Message, message);
                var detail = ctx.Exception.Data[ErrorConstants.Detail] as string;
                if (string.IsNullOrEmpty(detail)) ctx.ProblemDetails.Detail = detail;
            }
        });
        services.AddExceptionHandler<CustomExceptionHandler>();

        services.AddControllers()
            .AddJsonOptions(x =>
            {
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                x.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            })
            .ConfigureApiBehaviorOptions(options => options.SuppressModelStateInvalidFilter = true);
        services.AddSignalR()
            .AddJsonProtocol(c =>
            {
                c.PayloadSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                c.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                c.PayloadSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            });
        services.AddTransient<IClientConnector, ClientConnector>();


        services.ConfigureLocalization();

        services.AddSwagger();

        return services;
    }

    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            // Include 'SecurityScheme' to use JWT Authentication
            var jwtSecurityScheme = new OpenApiSecurityScheme
            {
                BearerFormat = "JWT",
                Name = "JWT Authentication",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = JwtBearerDefaults.AuthenticationScheme,
                Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

                Reference = new OpenApiReference
                {
                    Id = JwtBearerDefaults.AuthenticationScheme,
                    Type = ReferenceType.SecurityScheme
                }
            };
            options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                { jwtSecurityScheme, Array.Empty<string>() }
            });

            options.SchemaFilter<RequireNonNullablePropertiesSchemaFilter>();
            options.SchemaFilter<EnumSchemaFilter>();
            options.SupportNonNullableReferenceTypes(); // Sets Nullable flags appropriately.       
            options.UseAllOfToExtendReferenceSchemas(); // Allows $ref enums to be nullable
            //options.UseAllOfForInheritance();  // Allows $ref objects to be nullable
        });
        services.AddFluentValidationRulesToSwagger();

        return services;
    }

    internal static IServiceCollection ConfigureLocalization(this IServiceCollection services)
    {
        //services.AddLocalization();
        // Cấu hình Localization theo ngôn ngữ
        services.Configure<RequestLocalizationOptions>(options =>
        {
            // Danh sách các culture được hỗ trợ
            var supportedCultures = new List<CultureInfo> {
                new CultureInfo ("vi-VN"),
                //new CultureInfo ("en-US"),
                //new CultureInfo ("fr-FR")
            };

            // Thiết lập culture mặc định
            options.DefaultRequestCulture = new RequestCulture(supportedCultures.First());

            // Thêm các culture được hỗ trợ vào options
            options.SupportedCultures = supportedCultures;
            options.SupportedUICultures = supportedCultures;

            // Tạo một danh sách mới cho các RequestCultureProvider
            options.RequestCultureProviders = new List<IRequestCultureProvider> {
                new QueryStringRequestCultureProvider(),
                //new CookieRequestCultureProvider () 
                new AcceptLanguageHeaderRequestCultureProvider(),
             };
        });

        return services;
    }
}

internal sealed class RequireNonNullablePropertiesSchemaFilter : ISchemaFilter
{
    /// <summary>
    /// Add to model.Required all properties where Nullable is false.
    /// </summary>
    /// https://stackoverflow.com/a/68987970
    public void Apply(OpenApiSchema model, SchemaFilterContext context)
    {
        var additionalRequiredProps = model.Properties
            .Where(x => !x.Value.Nullable && !model.Required.Contains(x.Key))
            .Select(x => x.Key);
        foreach (var propKey in additionalRequiredProps)
        {
            model.Required.Add(propKey);
        }
    }
}

internal sealed class EnumSchemaFilter : ISchemaFilter
{
    /// <summary>
    /// Add x-enum-varnames supporting enum
    /// </summary>
    /// https://github.com/domaindrivendev/Swashbuckle.WebApi/issues/1287
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type.IsEnum)
        {
            var array = new OpenApiArray();
            array.AddRange(Enum.GetNames(context.Type).Select(n => new OpenApiString(n)));
            schema.Extensions.Add("x-enum-varnames", array);
        }
    }
}
