namespace LogViewer.Api.DTOs;

public class LogFilterRequest
{
    public string? EventKey { get; set; }
    public string? Application { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}

public class LogResponse
{
    public List<LogEntryDto> Logs { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class LogEntryDto
{
    public int ID { get; set; }
    public DateTime Logged { get; set; }
    public string EventKey { get; set; } = string.Empty;
    public string Application { get; set; } = string.Empty;
    public string AppKey { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string LogLevel { get; set; } = string.Empty;
    public string Audit { get; set; } = string.Empty;
    public string? MQMessage { get; set; }
    public string? Exception { get; set; }
    public string? StackTrace { get; set; }
    public string SiteName { get; set; } = string.Empty;
    public string MachineName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string CallSite { get; set; } = string.Empty;
    public string RemoteAddress { get; set; } = string.Empty;
    public int ProcessID { get; set; }
    public string Logger { get; set; } = string.Empty;
    public string? Properties { get; set; }
    public string ServerName { get; set; } = string.Empty;
    public string ServerAddress { get; set; } = string.Empty;
    public int Port { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Https { get; set; } = string.Empty;
    public string Process { get; set; } = string.Empty;
    public string Context { get; set; } = string.Empty;
    public int Timing { get; set; }
    public string? Settings { get; set; }
}
