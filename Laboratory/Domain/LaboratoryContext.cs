using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class LaboratoryContext : DbContext
    {
        public LaboratoryContext(DbContextOptions<LaboratoryContext> options)
            : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Formule> Formules { get; set; }
        public DbSet<Element> Elements { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Journal> Journal { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Конфигурация связей One-to-Many для таблицы Recipes и Ingredients
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Ingredients)
                .WithOne(i => i.Recipe)
                .HasForeignKey(i => i.recipeId);

            // Конфигурация связей One-to-Many для таблицы Users и Recipes
            modelBuilder.Entity<User>()
                .HasMany(u => u.Recipes)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.user_id);

            // Конфигурация связей One-to-Many для таблицы Recipes и Reviews
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Reviews)
                .WithOne(re => re.Recipe)
                .HasForeignKey(re => re.Recipe_Id);

            // Конфигурация связей One-to-Many для таблицы Users и Reviews
            modelBuilder.Entity<User>()
                .HasMany(u => u.Reviews)
                .WithOne(re => re.User)
                .HasForeignKey(re => re.User_Id);

            // Конфигурация связей One-to-Many для таблицы Users и Journal
            modelBuilder.Entity<User>()
                .HasMany(u => u.Journal)
                .WithOne(j => j.User)
                .HasForeignKey(j => j.User_Id);

            // Конфигурация связей One-to-Many для таблицы Recipes и Journal
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Journal)
                .WithOne(j => j.Recipe)
                .HasForeignKey(j => j.Recipe_Id);
        }
    }
}
