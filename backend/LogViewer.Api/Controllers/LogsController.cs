using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LogViewer.Api.Data;
using LogViewer.Api.DTOs;
using LogViewer.Api.Models;

namespace LogViewer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly LogDbContext _context;
    private readonly ILogger<LogsController> _logger;

    public LogsController(LogDbContext context, ILogger<LogsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get filtered and paginated logs
    /// </summary>
    [HttpPost("filter")]
    [ProducesResponseType(typeof(LogResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LogResponse>> GetFilteredLogs([FromBody] LogFilterRequest request)
    {
        try
        {
            var query = _context.Logs.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.EventKey))
            {
                query = query.Where(l => l.EventKey.Contains(request.EventKey));
            }

            if (!string.IsNullOrEmpty(request.Application))
            {
                query = query.Where(l => l.Application == request.Application);
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(l => l.Logged >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                var endDate = request.EndDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(l => l.Logged <= endDate);
            }

            // Get total count for pagination
            var totalCount = await query.CountAsync();

            // Apply pagination
            var logs = await query
                .OrderByDescending(l => l.Logged)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(l => new LogEntryDto
                {
                    ID = l.ID,
                    Logged = l.Logged,
                    EventKey = l.EventKey,
                    Application = l.Application,
                    AppKey = l.AppKey,
                    Module = l.Module,
                    Action = l.Action,
                    Stage = l.Stage,
                    Message = l.Message,
                    LogLevel = l.LogLevel,
                    Audit = l.Audit,
                    MQMessage = l.MQMessage,
                    Exception = l.Exception,
                    StackTrace = l.StackTrace,
                    SiteName = l.SiteName,
                    MachineName = l.MachineName,
                    UserName = l.UserName,
                    CallSite = l.CallSite,
                    RemoteAddress = l.RemoteAddress,
                    ProcessID = l.ProcessID,
                    Logger = l.Logger,
                    Properties = l.Properties,
                    ServerName = l.ServerName,
                    ServerAddress = l.ServerAddress,
                    Port = l.Port,
                    Url = l.Url,
                    Https = l.Https,
                    Process = l.Process,
                    Context = l.Context,
                    Timing = l.Timing,
                    Settings = l.Settings
                })
                .ToListAsync();

            var response = new LogResponse
            {
                Logs = logs,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.PageSize)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving logs");
            return StatusCode(500, "An error occurred while retrieving logs");
        }
    }

    /// <summary>
    /// Get unique applications for filter dropdown
    /// </summary>
    [HttpGet("applications")]
    [ProducesResponseType(typeof(List<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<string>>> GetApplications()
    {
        try
        {
            var applications = await _context.Logs
                .Select(l => l.Application)
                .Distinct()
                .OrderBy(a => a)
                .ToListAsync();

            return Ok(applications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications");
            return StatusCode(500, "An error occurred while retrieving applications");
        }
    }

    /// <summary>
    /// Get a single log by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(LogEntryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LogEntryDto>> GetLogById(int id)
    {
        try
        {
            var log = await _context.Logs
                .Where(l => l.ID == id)
                .Select(l => new LogEntryDto
                {
                    ID = l.ID,
                    Logged = l.Logged,
                    EventKey = l.EventKey,
                    Application = l.Application,
                    AppKey = l.AppKey,
                    Module = l.Module,
                    Action = l.Action,
                    Stage = l.Stage,
                    Message = l.Message,
                    LogLevel = l.LogLevel,
                    Audit = l.Audit,
                    MQMessage = l.MQMessage,
                    Exception = l.Exception,
                    StackTrace = l.StackTrace,
                    SiteName = l.SiteName,
                    MachineName = l.MachineName,
                    UserName = l.UserName,
                    CallSite = l.CallSite,
                    RemoteAddress = l.RemoteAddress,
                    ProcessID = l.ProcessID,
                    Logger = l.Logger,
                    Properties = l.Properties,
                    ServerName = l.ServerName,
                    ServerAddress = l.ServerAddress,
                    Port = l.Port,
                    Url = l.Url,
                    Https = l.Https,
                    Process = l.Process,
                    Context = l.Context,
                    Timing = l.Timing,
                    Settings = l.Settings
                })
                .FirstOrDefaultAsync();

            if (log == null)
            {
                return NotFound();
            }

            return Ok(log);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving log by ID");
            return StatusCode(500, "An error occurred while retrieving the log");
        }
    }

    /// <summary>
    /// Get logs by EventKey (for grouping)
    /// </summary>
    [HttpGet("eventkey/{eventKey}")]
    [ProducesResponseType(typeof(List<LogEntryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<LogEntryDto>>> GetLogsByEventKey(string eventKey)
    {
        try
        {
            var logs = await _context.Logs
                .Where(l => l.EventKey == eventKey)
                .OrderBy(l => l.Logged)
                .Select(l => new LogEntryDto
                {
                    ID = l.ID,
                    Logged = l.Logged,
                    EventKey = l.EventKey,
                    Application = l.Application,
                    AppKey = l.AppKey,
                    Module = l.Module,
                    Action = l.Action,
                    Stage = l.Stage,
                    Message = l.Message,
                    LogLevel = l.LogLevel,
                    Audit = l.Audit,
                    MQMessage = l.MQMessage,
                    Exception = l.Exception,
                    StackTrace = l.StackTrace,
                    SiteName = l.SiteName,
                    MachineName = l.MachineName,
                    UserName = l.UserName,
                    CallSite = l.CallSite,
                    RemoteAddress = l.RemoteAddress,
                    ProcessID = l.ProcessID,
                    Logger = l.Logger,
                    Properties = l.Properties,
                    ServerName = l.ServerName,
                    ServerAddress = l.ServerAddress,
                    Port = l.Port,
                    Url = l.Url,
                    Https = l.Https,
                    Process = l.Process,
                    Context = l.Context,
                    Timing = l.Timing,
                    Settings = l.Settings
                })
                .ToListAsync();

            return Ok(logs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving logs by EventKey");
            return StatusCode(500, "An error occurred while retrieving logs");
        }
    }
}
