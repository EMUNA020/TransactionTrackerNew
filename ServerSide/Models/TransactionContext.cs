using Microsoft.EntityFrameworkCore;

namespace ServerSide.Models
{
    public class TransactionContext : DbContext
    {
        public TransactionContext(DbContextOptions<TransactionContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Transactions> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transactions>().ToTable("Transactions");
            modelBuilder.Entity<Category>().ToTable("Category");

            base.OnModelCreating(modelBuilder);
        }
    }
}
