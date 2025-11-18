# Log Viewer API - Backend

ASP.NET Core Web API for serving log data from SQL Server database.

## Prerequisites

- .NET 8.0 SDK
- SQL Server (2016 or higher)

## Setup

### 1. Database Setup

Run the SQL setup script to create the database and tables:

```bash
sqlcmd -S localhost -i database-setup.sql
```

Or execute the script in SQL Server Management Studio (SSMS) or Azure Data Studio.

### 2. Configure Connection String

Edit `appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=LogViewerDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

For SQL Authentication:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=LogViewerDB;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

### 3. Restore Dependencies

```bash
cd LogViewer.Api
dotnet restore
```

### 4. Run the API

Development mode:
```bash
dotnet run
```

Or with watch mode (auto-restart on file changes):
```bash
dotnet watch run
```

The API will be available at:
- HTTP: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

## API Endpoints

### Logs

#### POST /api/logs/filter
Filter and paginate logs.

**Request Body:**
```json
{
  "eventKey": "string (optional)",
  "application": "string (optional)",
  "startDate": "datetime (optional)",
  "endDate": "datetime (optional)",
  "page": 1,
  "pageSize": 25
}
```

**Response:**
```json
{
  "logs": [ /* array of log entries */ ],
  "totalCount": 1000,
  "page": 1,
  "pageSize": 25,
  "totalPages": 40
}
```

#### GET /api/logs/applications
Get list of unique application names.

**Response:**
```json
["OrderService", "PaymentService", "InventoryService"]
```

#### GET /api/logs/{id}
Get a single log entry by ID.

**Response:**
```json
{
  "id": 1,
  "logged": "2024-01-01T12:00:00",
  "eventKey": "abc-123",
  // ... other fields
}
```

#### GET /api/logs/eventkey/{eventKey}
Get all logs with a specific EventKey (for grouping related logs).

**Response:**
```json
[ /* array of log entries with same EventKey */ ]
```

## Project Structure

```
LogViewer.Api/
├── Controllers/
│   └── LogsController.cs      # API endpoints
├── Data/
│   └── LogDbContext.cs        # EF Core database context
├── Models/
│   └── LogEntry.cs            # Log entity model
├── DTOs/
│   └── LogDtos.cs             # Data transfer objects
├── Properties/
│   └── launchSettings.json    # Debug settings
├── Program.cs                 # Application entry point
├── appsettings.json           # Configuration
└── LogViewer.Api.csproj       # Project file
```

## Database Schema

The `Logs` table includes:

**Basic Information:**
- ID (int, primary key)
- Logged (datetime2)
- EventKey (nvarchar(50))
- LogLevel (nvarchar(20))
- Stage (nvarchar(50))

**Application Details:**
- Application (nvarchar(100))
- AppKey (nvarchar(100))
- Module (nvarchar(100))
- Action (nvarchar(100))
- CallSite (nvarchar(500))
- Logger (nvarchar(200))
- Process (nvarchar(200))

**Message & Tracking:**
- Message (nvarchar(max))
- Audit (nvarchar(10))
- MQMessage (nvarchar(200))
- Context (nvarchar(200))
- Timing (int)

**Error Information:**
- Exception (nvarchar(max))
- StackTrace (nvarchar(max))

**System Information:**
- SiteName (nvarchar(200))
- MachineName (nvarchar(100))
- ServerName (nvarchar(200))
- ServerAddress (nvarchar(50))
- RemoteAddress (nvarchar(50))
- Port (int)
- ProcessID (int)

**User & Request:**
- UserName (nvarchar(200))
- Url (nvarchar(1000))
- Https (nvarchar(10))

**Additional Data:**
- Properties (nvarchar(max))
- Settings (nvarchar(max))

### Indexes

The following indexes are created for optimal query performance:
- `IX_Logs_EventKey` on EventKey
- `IX_Logs_Application` on Application
- `IX_Logs_Logged` on Logged (DESC)
- `IX_Logs_EventKey_Logged` on (EventKey, Logged DESC)

## Development

### Build

```bash
dotnet build
```

### Test

```bash
dotnet test
```

### Publish (Production)

```bash
dotnet publish -c Release -o ./publish
```

## Deployment

### IIS Deployment

1. Publish the application
2. Create an application pool (No Managed Code)
3. Deploy to IIS site
4. Ensure connection string is configured

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["LogViewer.Api/LogViewer.Api.csproj", "LogViewer.Api/"]
RUN dotnet restore "LogViewer.Api/LogViewer.Api.csproj"
COPY . .
WORKDIR "/src/LogViewer.Api"
RUN dotnet build "LogViewer.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LogViewer.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LogViewer.Api.dll"]
```

Build and run:
```bash
docker build -t log-viewer-api .
docker run -p 5000:80 log-viewer-api
```

### Azure App Service

1. Publish using Visual Studio or CLI
2. Configure connection string in Application Settings
3. Enable CORS if needed

## Environment Variables

The API uses these configuration sources (in order of precedence):
1. Command-line arguments
2. Environment variables
3. appsettings.{Environment}.json
4. appsettings.json

Example environment variables:
```bash
ConnectionStrings__DefaultConnection="Server=..."
Logging__LogLevel__Default="Information"
```

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to SQL Server

**Solutions:**
- Verify SQL Server is running
- Check firewall settings
- Verify connection string
- Test connection with SSMS

### CORS Issues

**Problem:** Frontend cannot access API

**Solutions:**
- Check CORS configuration in Program.cs
- Verify frontend URL in AllowedOrigins
- Check browser console for CORS errors

### Performance Issues

**Problem:** Slow queries

**Solutions:**
- Check index usage with SQL Server execution plans
- Update statistics: `UPDATE STATISTICS Logs`
- Consider database partitioning for very large tables
- Monitor using SQL Server DMVs

## License

MIT License
