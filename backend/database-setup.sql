-- Create the Log Viewer Database
-- Run this script on your SQL Server instance to create the database and table

USE master;
GO

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'LogViewerDB')
BEGIN
    CREATE DATABASE LogViewerDB;
END
GO

USE LogViewerDB;
GO

-- Create Logs table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Logs' AND xtype='U')
BEGIN
    CREATE TABLE Logs (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        Logged DATETIME2 NOT NULL,
        EventKey NVARCHAR(50) NOT NULL,
        Application NVARCHAR(100) NOT NULL,
        AppKey NVARCHAR(100) NOT NULL,
        Module NVARCHAR(100) NOT NULL,
        Action NVARCHAR(100) NOT NULL,
        Stage NVARCHAR(50) NOT NULL,
        Message NVARCHAR(MAX) NULL,
        LogLevel NVARCHAR(20) NOT NULL,
        Audit NVARCHAR(10) NOT NULL,
        MQMessage NVARCHAR(200) NULL,
        Exception NVARCHAR(MAX) NULL,
        StackTrace NVARCHAR(MAX) NULL,
        SiteName NVARCHAR(200) NOT NULL,
        MachineName NVARCHAR(100) NOT NULL,
        UserName NVARCHAR(200) NOT NULL,
        CallSite NVARCHAR(500) NOT NULL,
        RemoteAddress NVARCHAR(50) NOT NULL,
        ProcessID INT NOT NULL,
        Logger NVARCHAR(200) NOT NULL,
        Properties NVARCHAR(MAX) NULL,
        ServerName NVARCHAR(200) NOT NULL,
        ServerAddress NVARCHAR(50) NOT NULL,
        Port INT NOT NULL,
        Url NVARCHAR(1000) NOT NULL,
        Https NVARCHAR(10) NOT NULL,
        Process NVARCHAR(200) NOT NULL,
        Context NVARCHAR(200) NOT NULL,
        Timing INT NOT NULL,
        Settings NVARCHAR(MAX) NULL
    );
END
GO

-- Create indexes for better query performance
CREATE NONCLUSTERED INDEX IX_Logs_EventKey ON Logs(EventKey);
CREATE NONCLUSTERED INDEX IX_Logs_Application ON Logs(Application);
CREATE NONCLUSTERED INDEX IX_Logs_Logged ON Logs(Logged DESC);
CREATE NONCLUSTERED INDEX IX_Logs_EventKey_Logged ON Logs(EventKey, Logged DESC);
GO

-- Insert sample data (optional - for testing)
DECLARE @i INT = 1;
DECLARE @EventKey NVARCHAR(50);
DECLARE @Application NVARCHAR(100);
DECLARE @LogLevel NVARCHAR(20);

WHILE @i <= 100
BEGIN
    SET @EventKey = CAST(NEWID() AS NVARCHAR(50));
    SET @Application = CASE (@i % 5)
        WHEN 0 THEN 'OrderService'
        WHEN 1 THEN 'PaymentService'
        WHEN 2 THEN 'InventoryService'
        WHEN 3 THEN 'UserService'
        ELSE 'NotificationService'
    END;
    SET @LogLevel = CASE (@i % 5)
        WHEN 0 THEN 'DEBUG'
        WHEN 1 THEN 'INFO'
        WHEN 2 THEN 'WARNING'
        WHEN 3 THEN 'ERROR'
        ELSE 'CRITICAL'
    END;

    INSERT INTO Logs (
        Logged, EventKey, Application, AppKey, Module, Action, Stage, Message, LogLevel,
        Audit, MQMessage, Exception, StackTrace, SiteName, MachineName, UserName, CallSite,
        RemoteAddress, ProcessID, Logger, Properties, ServerName, ServerAddress, Port, Url,
        Https, Process, Context, Timing, Settings
    )
    VALUES (
        DATEADD(HOUR, -@i, GETDATE()),
        @EventKey,
        @Application,
        @Application + '-key-' + CAST(@i AS NVARCHAR(10)),
        'API',
        'Process',
        'Complete',
        'Sample log message ' + CAST(@i AS NVARCHAR(10)),
        @LogLevel,
        'false',
        'Message-' + CAST(@i AS NVARCHAR(10)),
        CASE WHEN @LogLevel = 'ERROR' THEN 'System.Exception: Error occurred' ELSE NULL END,
        CASE WHEN @LogLevel = 'ERROR' THEN 'at System.Runtime.CompilerServices...' ELSE NULL END,
        'production-site',
        'srv-1',
        'user@example.com',
        @Application + '.API.Process',
        '192.168.1.1',
        1234,
        @Application + '.Logger',
        '{"requestId":"' + CAST(NEWID() AS NVARCHAR(50)) + '"}',
        'server-1',
        '10.0.0.1',
        443,
        'https://api.example.com/process',
        'true',
        @Application,
        'Context-' + CAST(@i AS NVARCHAR(10)),
        CAST(RAND() * 5000 AS INT),
        '{"timeout":30000,"retries":3}'
    );

    SET @i = @i + 1;
END
GO

PRINT 'Database and table created successfully with sample data!';
GO
