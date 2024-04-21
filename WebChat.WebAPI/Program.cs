using WebChat.Application;
using WebChat.Infrastructure;
using WebChat.Persistence;
using WebChat.WebAPI;
using WebChat.WebAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddApplicationServices()
    .AddPersistenceServices(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration)
    .AddWebAPIServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    await app.InitialiseDatabaseAsync();

    app.UseCors(policy => policy
        .SetIsOriginAllowed(origins => true)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
    );
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseMiniProfiler();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseHealthChecks("/health");
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseRequestLocalization();

app.UseHttpLogging();

app.UseStatusCodePages();
app.UseExceptionHandler();

app.MapHub<ApplicationHub>("/hub/Application");
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
