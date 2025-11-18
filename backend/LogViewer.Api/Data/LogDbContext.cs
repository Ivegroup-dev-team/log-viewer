using Microsoft.EntityFrameworkCore;
using LogViewer.Api.Models;

namespace LogViewer.Api.Data;

public class LogDbContext : DbContext
{
    public LogDbContext(DbContextOptions<LogDbContext> options) : base(options)
    {
    }

    public DbSet<LogEntry> Logs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Create indexes for better query performance
        modelBuilder.Entity<LogEntry>()
            .HasIndex(l => l.EventKey)
            .HasDatabaseName("IX_Logs_EventKey");

        modelBuilder.Entity<LogEntry>()
            .HasIndex(l => l.Application)
            .HasDatabaseName("IX_Logs_Application");

        modelBuilder.Entity<LogEntry>()
            .HasIndex(l => l.Logged)
            .HasDatabaseName("IX_Logs_Logged");

        modelBuilder.Entity<LogEntry>()
            .HasIndex(l => new { l.EventKey, l.Logged })
            .HasDatabaseName("IX_Logs_EventKey_Logged");
    }
}
