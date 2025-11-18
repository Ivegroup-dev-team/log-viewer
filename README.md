# Log Viewer

A full-stack TypeScript/C# application for viewing and filtering database logs stored in SQL Server. The solution consists of a React TypeScript frontend and an ASP.NET Core Web API backend.

## Features

- **Advanced Filtering**: Filter logs by EventKey, Application, and Date range
- **Server-Side Pagination**: Efficiently handle millions of log entries with database-level pagination
- **Expandable Rows**: Click on any row to view detailed log information
- **Log Level Indicators**: Color-coded log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- **Export to CSV**: Export filtered logs to CSV format
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript Frontend**: Full type safety in React application
- **C# Backend**: ASP.NET Core Web API with Entity Framework Core
- **SQL Server**: Optimized database schema with proper indexing

## Database Schema

The application handles logs with the following columns:

### Basic Information
- ID, Logged, EventKey, LogLevel, Stage

### Application Details
- Application, AppKey, Module, Action, CallSite, Logger, Process

### Message & Tracking
- Message, Audit, MQMessage, Context, Timing

### Error Information
- Exception, StackTrace

### System Information
- SiteName, MachineName, ServerName, ServerAddress, RemoteAddress, Port, ProcessID

### User & Request Information
- UserName, Url, Https

### Additional Data
- Properties, Settings

## Technology Stack

### Frontend
- **React 18.2**: Modern React with functional components and hooks
- **TypeScript 5.3**: Full type safety throughout the application
- **React Scripts 5.0**: Zero-config build setup

### Backend
- **ASP.NET Core 8.0**: Modern web API framework
- **Entity Framework Core 8.0**: ORM for SQL Server
- **SQL Server**: Enterprise-grade database

## Architecture

```
┌─────────────────┐
│  React Frontend │
│  (TypeScript)   │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  ASP.NET Core   │
│    Web API      │
│      (C#)       │
└────────┬────────┘
         │ EF Core
         │
┌────────▼────────┐
│   SQL Server    │
│   Database      │
└─────────────────┘
```

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **.NET 8.0 SDK**
- **SQL Server** (2016 or higher, or SQL Server Express)

### Database Setup

1. Ensure SQL Server is running and accessible

2. Run the database setup script:
```bash
sqlcmd -S localhost -i backend/database-setup.sql
```

Or use SQL Server Management Studio (SSMS) to execute the script.

3. Update the connection string in `backend/LogViewer.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=LogViewerDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

For SQL Server Authentication, use:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=LogViewerDB;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/LogViewer.Api
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the API:
```bash
dotnet run
```

The API will start on `http://localhost:5000` by default.

### Frontend Setup

1. Navigate to the root directory:
```bash
cd /path/to/log-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at [http://localhost:3000](http://localhost:3000).

## API Endpoints

### POST /api/logs/filter
Filter and paginate logs
```json
{
  "eventKey": "optional-event-key",
  "application": "optional-application-name",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "page": 1,
  "pageSize": 25
}
```

### GET /api/logs/applications
Get list of unique applications

### GET /api/logs/{id}
Get a single log by ID

### GET /api/logs/eventkey/{eventKey}
Get all logs with a specific EventKey (for grouping)

## Available Scripts

### Frontend

#### `npm start`
Runs the React app in development mode at [http://localhost:3000](http://localhost:3000)

#### `npm build`
Builds the app for production to the `build` folder

#### `npm test`
Launches the test runner in interactive watch mode

### Backend

#### `dotnet run`
Runs the API in development mode

#### `dotnet build`
Builds the project

#### `dotnet publish -c Release`
Publishes the application for deployment

## Usage

### Filtering Logs

1. **Event Key**: Enter a partial or full Event Key to filter logs
2. **Application**: Select an application from the dropdown
3. **Date Range**: Use Start Date and End Date inputs to filter by time range
4. **Quick Filters**: Use "Last 7 Days" or "Last 30 Days" buttons

### Viewing Log Details

Click on any log row to expand and view full details including:
- Complete log information
- Error details (if applicable)
- System information
- User and request information
- Additional metadata

### Exporting Data

Click the "Export to CSV" button to download the currently filtered logs.

### Pagination

- Navigate through pages using First, Previous, Next, and Last buttons
- Change items per page (10, 25, 50, or 100)
- Server-side pagination for optimal performance

## Project Structure

```
log-viewer/
├── backend/
│   ├── LogViewer.Api/
│   │   ├── Controllers/
│   │   │   └── LogsController.cs    # API endpoints
│   │   ├── Data/
│   │   │   └── LogDbContext.cs      # EF Core DbContext
│   │   ├── Models/
│   │   │   └── LogEntry.cs          # Log entity model
│   │   ├── DTOs/
│   │   │   └── LogDtos.cs           # Data transfer objects
│   │   ├── Program.cs               # Application entry point
│   │   ├── appsettings.json         # Configuration
│   │   └── LogViewer.Api.csproj     # Project file
│   └── database-setup.sql           # SQL Server setup script
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FilterPanel.tsx          # Filter controls
│   │   ├── FilterPanel.css
│   │   ├── LogTable.tsx             # Main table with pagination
│   │   ├── LogTable.css
│   │   ├── LogDetails.tsx           # Expandable log details
│   │   └── LogDetails.css
│   ├── services/
│   │   └── logService.ts            # API client
│   ├── utils/
│   │   └── helpers.ts               # Utility functions
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── App.tsx                      # Main application component
│   ├── App.css
│   ├── index.tsx                    # Application entry point
│   └── index.css
├── .env.development                 # Development environment config
├── .env.production                  # Production environment config
├── package.json
├── tsconfig.json
└── README.md
```

## Performance Considerations

- **Database Indexing**: Indexes on EventKey, Application, and Logged columns
- **Server-Side Pagination**: Only requested page data is fetched from database
- **Debounced Search**: Filter inputs are debounced (300ms) to reduce API calls
- **Efficient Queries**: EF Core generates optimized SQL queries
- **Connection Pooling**: ASP.NET Core manages database connections efficiently

## Production Deployment

### Frontend Build

1. Build the React app:
```bash
npm run build
```

2. The build folder contains static files that can be served by the backend or any web server

### Backend Deployment

1. Publish the API:
```bash
cd backend/LogViewer.Api
dotnet publish -c Release -o ./publish
```

2. Deploy to IIS, Azure App Service, or Docker container

### Integrated Deployment

The backend is configured to serve the React frontend in production:
1. Build the frontend: `npm run build`
2. Copy the `build` folder contents to `backend/LogViewer.Api/wwwroot`
3. Publish and deploy the backend

## Database Maintenance

### Indexing Strategy

The application creates the following indexes:
- `IX_Logs_EventKey`: For EventKey filtering
- `IX_Logs_Application`: For Application filtering
- `IX_Logs_Logged`: For date sorting
- `IX_Logs_EventKey_Logged`: Composite index for grouped queries

### Performance Tips

For tables with millions of rows:
- Regularly update statistics: `UPDATE STATISTICS Logs`
- Consider partitioning by date
- Archive old logs to separate tables
- Use filtered indexes for specific queries

## Configuration

### Frontend Configuration (.env files)

Development (`.env.development`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Production (`.env.production`):
```
REACT_APP_API_URL=/api
```

### Backend Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=LogViewerDB;..."
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

## Troubleshooting

### Backend Connection Issues

1. Verify SQL Server is running
2. Check connection string in `appsettings.json`
3. Ensure firewall allows SQL Server connections
4. Test connection with SSMS or Azure Data Studio

### CORS Issues

If frontend can't connect to backend:
1. Verify backend is running on correct port
2. Check CORS configuration in `Program.cs`
3. Update `REACT_APP_API_URL` in `.env.development`

### Build Issues

Frontend:
```bash
rm -rf node_modules package-lock.json
npm install
```

Backend:
```bash
dotnet clean
dotnet restore
dotnet build
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.