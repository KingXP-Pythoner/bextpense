using Bextpense.Commands.Services;
using Bextpense.Infrastructure.Data;
using Bextpense.Queries.AllTransactions;
using Bextpense.Queries.AllTransactions.Services;
using Bextpense.Queries.Home.GetTransactionOverview.Services;
using Bextpense.Services;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

// Load .env file
Env.Load();
var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
var corsOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS");
if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("CONNECTION_STRING is not set");
}

// Add Cors Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CorsPolicy",
        policyBuilder =>
        {
            policyBuilder.AllowAnyHeader();
            policyBuilder.AllowAnyMethod().WithOrigins(corsOrigins ?? "http://localhost:3000");
        }
    );
});

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));

// Add seeder service
builder.Services.AddScoped<AppDbSeeder>();

// Register services
builder.Services.AddScoped<
    ITransactionService,
    Bextpense.Queries.AllTransactions.Services.TransactionService
>();
builder.Services.AddScoped<ITransactionAnalysisService, TransactionAnalysisService>();
builder.Services.AddScoped<ITransactionCommandService, TransactionCommandService>();
builder.Services.AddScoped<IPdfExportService, PdfExportService>();

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference();
}

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var seeder = services.GetRequiredService<AppDbSeeder>();
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database");
        throw;
    }
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
