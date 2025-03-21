using System;
using System.Collections.Generic;
using Bextpense.Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Bextpense.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<TransactionType> TransactionTypes { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // // Seed the Transaction Types
        // modelBuilder
        //     .Entity<TransactionType>()
        //     .HasData(
        //         new TransactionType { TransactionTypeId = 1, Type = "income" },
        //         new TransactionType { TransactionTypeId = 2, Type = "expense" }
        //     );

        // // Seed the Categories
        // var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        // var categories = new List<Category>()
        // {
        //     // Income Categories
        //     new Category
        //     {
        //         CategoryId = "salary",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "freelance",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "investments",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "business_revenue",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "gifts",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "refunds",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "bonuses",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "rental_income",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "other_income",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     // Expense Categories
        //     new Category
        //     {
        //         CategoryId = "rent",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "mortgage",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "property_taxes",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "home_insurance",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "electricity",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "water",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "gas",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "internet",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "phone_bill",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "groceries",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "restaurants",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "coffee_shops",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "fast_food",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "fuel",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "public_transport",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "car_maintenance",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "parking",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "ride_sharing",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "medical_bills",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "health_insurance",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "gym_membership",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "pharmacy",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "streaming_services",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "movies",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "concerts",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "gaming",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "clothing",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "accessories",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "electronics",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "home_decor",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "courses",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "books",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "subscriptions",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "school_fees",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "credit_card_payments",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "student_loans",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "personal_loans",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "retirement_fund",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "stocks",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "emergency_fund",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "flights",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "hotels",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "transportation",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "tourist_activities",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "charity",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "gifts_expenses",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        //     new Category
        //     {
        //         CategoryId = "miscellaneous",
        //         CreatedAt = now,
        //         UpdatedAt = now,
        //         IsDeleted = false,
        //     },
        // };

        // modelBuilder.Entity<Category>().HasData(categories);

        modelBuilder
            .Entity<Transaction>()
            .Property(t => t.Amount)
            .HasPrecision(18, 2); // 18 total digits, 2 decimal places

        modelBuilder
            .Entity<Transaction>()
            .HasOne(t => t.Category)
            .WithMany()
            .HasForeignKey(t => t.CategoryId);

        modelBuilder
            .Entity<Transaction>()
            .HasOne(t => t.TransactionType)
            .WithMany()
            .HasForeignKey(t => t.Type);
    }
}
