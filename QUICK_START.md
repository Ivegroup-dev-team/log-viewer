# Quick Start Guide - Log Viewer

This guide will help you get the Log Viewer application up and running in minutes.

## Prerequisites Check

Before starting, ensure you have:

- [ ] **Node.js 16+** - Check with `node --version`
- [ ] **npm 7+** - Check with `npm --version`
- [ ] **.NET 8.0 SDK** - Check with `dotnet --version`
- [ ] **SQL Server** - SQL Server 2016+, Express, or LocalDB

## Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ivegroup-dev-team/log-viewer.git
cd log-viewer
```

### Step 2: Set Up the Database

#### Option A: Using sqlcmd (Command Line)
```bash
sqlcmd -S localhost -E -i backend/database-setup.sql
```

#### Option B: Using SQL Server Management Studio (SSMS)
1. Open SSMS
2. Connect to your SQL Server instance
3. Open `backend/database-setup.sql`
4. Execute the script (F5)
5. Verify the `LogViewerDB` database was created

#### Option C: Using Azure Data Studio
1. Open Azure Data Studio
2. Connect to your SQL Server instance
3. Open `backend/database-setup.sql`
4. Run the script
5. Refresh the databases list to see `LogViewerDB`

### Step 3: Configure the Backend

Navigate to the backend configuration file:
```bash
cd backend/LogViewer.Api
```

Edit `appsettings.json` and update the connection string:

**For Windows Authentication (Trusted Connection):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LogViewerDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**For SQL Authentication:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LogViewerDB;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**For LocalDB (Development):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=LogViewerDB;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### Step 4: Start the Backend API

```bash
# From backend/LogViewer.Api directory
dotnet restore
dotnet run
```

✅ You should see:
```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

📝 **Note:** Leave this terminal window open - the API needs to keep running.

🌐 **Test the API:** Open http://localhost:5000/swagger in your browser to see the API documentation.

### Step 5: Install Frontend Dependencies

Open a **NEW terminal window** and navigate to the project root:

```bash
cd /path/to/log-viewer
npm install
```

⏱️ This will take 1-2 minutes to download all dependencies.

### Step 6: Start the Frontend Application

```bash
npm start
```

✅ The application will automatically open in your browser at http://localhost:3000

If it doesn't open automatically, manually navigate to: **http://localhost:3000**

## Verify Everything Works

### 1. Check the UI Loads
- You should see the "Log Viewer" header
- Filter panel with EventKey, Application, and Date inputs
- A table with log entries

### 2. Test Filtering
- Click "Last 7 Days" button - table should update
- Select an application from the dropdown - results should filter
- Type in the EventKey field - results should filter as you type

### 3. Test Pagination
- Click "Next" button to go to page 2
- Change page size to "50 per page"
- Click on a log row to expand details

### 4. Test Export
- Click "Export to CSV" button
- A CSV file should download with the current filtered logs

## Common Issues & Solutions

### Issue 1: Cannot Connect to Database
**Error:** `A network-related or instance-specific error occurred`

**Solutions:**
1. Verify SQL Server is running:
   - Windows: Check Services for "SQL Server"
   - Run: `Get-Service MSSQLSERVER` (PowerShell)

2. Check connection string server name:
   - `localhost` - for local default instance
   - `localhost\\SQLEXPRESS` - for SQL Server Express
   - `(localdb)\\mssqllocaldb` - for LocalDB

3. Enable TCP/IP in SQL Server Configuration Manager

### Issue 2: CORS Error in Browser
**Error:** `Access to fetch at 'http://localhost:5000/api/logs/filter' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
1. Verify backend is running on port 5000
2. Check `Program.cs` has CORS configuration
3. Restart the backend API

### Issue 3: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3000` or `:::5000`

**Solutions:**

**For Frontend (port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

**For Backend (port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Or modify Properties/launchSettings.json
```

### Issue 4: npm Install Fails
**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue 5: Swagger Not Loading
**Error:** `Cannot GET /swagger`

**Solution:**
- Swagger only works in Development mode
- Ensure `ASPNETCORE_ENVIRONMENT=Development` is set
- Check `Properties/launchSettings.json`

## Architecture Overview

```
┌──────────────────────────────────────────────────┐
│  Browser (http://localhost:3000)                 │
│  ┌────────────────────────────────────────────┐  │
│  │  React Application                         │  │
│  │  - Filter Panel                            │  │
│  │  - Log Table                               │  │
│  │  - Log Details                             │  │
│  └────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────┘
                   │ HTTP REST API
                   │ JSON
┌──────────────────▼───────────────────────────────┐
│  Backend API (http://localhost:5000)             │
│  ┌────────────────────────────────────────────┐  │
│  │  ASP.NET Core Web API                      │  │
│  │  - LogsController                          │  │
│  │  - Entity Framework Core                   │  │
│  └────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────┘
                   │ EF Core / SQL
                   │
┌──────────────────▼───────────────────────────────┐
│  SQL Server Database                             │
│  ┌────────────────────────────────────────────┐  │
│  │  LogViewerDB                               │  │
│  │  - Logs table (with indexes)               │  │
│  │  - Sample data (100 records)               │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## What's Next?

Now that you have the application running:

1. **Explore the Features:**
   - Try different filter combinations
   - Expand rows to see detailed log information
   - Export logs to CSV
   - Test pagination with different page sizes

2. **Add Real Data:**
   - Insert your actual log data into the `Logs` table
   - Update the connection string to point to your production database (read-only recommended)

3. **Customize:**
   - Modify the UI styling in component CSS files
   - Add new filter fields in `FilterPanel.tsx`
   - Extend the API with new endpoints in `LogsController.cs`

4. **Deploy:**
   - See the main README.md for deployment instructions
   - Consider Docker deployment for easier setup

## Need Help?

- **Documentation:** See `README.md` for complete documentation
- **API Reference:** Visit http://localhost:5000/swagger when backend is running
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`
- **Backend Docs:** See `backend/README.md`

## Quick Command Reference

```bash
# Start Backend (Terminal 1)
cd backend/LogViewer.Api
dotnet run

# Start Frontend (Terminal 2)
cd /path/to/log-viewer
npm start

# Build Frontend for Production
npm run build

# Build Backend for Production
cd backend/LogViewer.Api
dotnet publish -c Release -o ./publish

# Run TypeScript Type Check
npx tsc --noEmit

# Run Backend Tests (if added)
dotnet test
```

## Success! 🎉

You now have a fully functional log viewer application running locally. The application can:
- Display logs from SQL Server
- Filter by EventKey, Application, and Date range
- Handle millions of log entries efficiently
- Export data to CSV
- Provide detailed log information on demand

Happy log viewing! 📊
