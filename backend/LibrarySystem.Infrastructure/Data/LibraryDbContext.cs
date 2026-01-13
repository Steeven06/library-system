using LibrarySystem.Domain.Entities;

using System.Collections.Generic;
using System.Reflection.Emit;

using Microsoft.EntityFrameworkCore;

namespace LibrarySystem.Infrastructure.Data
{
    public class LibraryDbContext : DbContext
    {
        public LibraryDbContext(DbContextOptions<LibraryDbContext> options)
            : base(options)
        {
        }

        public DbSet<Books> Books { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Loan> Loans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Book → Author (muchos libros, un autor)
            modelBuilder.Entity<Books>()
                .HasOne(b => b.Author)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId);

            // Book → Category (muchos libros, una categoría)
            modelBuilder.Entity<Books>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId);

            // Loan → Book
            modelBuilder.Entity<Loan>()
                .HasOne(l => l.Book)
                .WithMany(b => b.Loans)
                .HasForeignKey(l => l.BookId);

            // Loan → User
            modelBuilder.Entity<Loan>()
                .HasOne(l => l.User)
                .WithMany(u => u.Loans)
                .HasForeignKey(l => l.UserId);

            modelBuilder.Entity<Loan>(entity =>
            {
                entity.Property(l => l.LoanDate)
                      .HasColumnType("timestamptz");

                entity.Property(l => l.ReturnDate)
                      .HasColumnType("timestamptz");
            });
        }
    }
}
