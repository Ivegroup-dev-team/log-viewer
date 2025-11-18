using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogViewer.Api.Models;

[Table("Logs")]
public class LogEntry
{
    [Key]
    public int ID { get; set; }
    
    [Required]
    public DateTime Logged { get; set; }
    
    [Required]
    [StringLength(50)]
    public string EventKey { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Application { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string AppKey { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string Module { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string Action { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string Stage { get; set; } = string.Empty;
    
    public string? Message { get; set; }
    
    [Required]
    [StringLength(20)]
    public string LogLevel { get; set; } = string.Empty;
    
    [StringLength(10)]
    public string Audit { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? MQMessage { get; set; }
    
    public string? Exception { get; set; }
    
    public string? StackTrace { get; set; }
    
    [StringLength(200)]
    public string SiteName { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string MachineName { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string UserName { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string CallSite { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string RemoteAddress { get; set; } = string.Empty;
    
    public int ProcessID { get; set; }
    
    [StringLength(200)]
    public string Logger { get; set; } = string.Empty;
    
    public string? Properties { get; set; }
    
    [StringLength(200)]
    public string ServerName { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string ServerAddress { get; set; } = string.Empty;
    
    public int Port { get; set; }
    
    [StringLength(1000)]
    public string Url { get; set; } = string.Empty;
    
    [StringLength(10)]
    public string Https { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string Process { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string Context { get; set; } = string.Empty;
    
    public int Timing { get; set; }
    
    public string? Settings { get; set; }
}
