import React, { useState, useEffect, useCallback } from 'react';
import { LogEntry, LogFilters } from './types';
import FilterPanel from './components/FilterPanel';
import LogTable from './components/LogTable';
import { fetchLogs, LogResponse } from './services/logService';
import { exportToCSV } from './utils/helpers';
import './App.css';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filters, setFilters] = useState<LogFilters>({
    eventKey: '',
    application: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch logs from API
  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: LogResponse = await fetchLogs(filters, currentPage, pageSize);
      setLogs(response.logs);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error loading logs:', err);
      setError('Failed to load logs. Please check your connection and try again.');
      setLogs([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  // Load logs when filters, page, or page size changes
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleFilterChange = useCallback((newFilters: LogFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(() => {
    if (logs.length > 0) {
      exportToCSV(logs, `log-export-${new Date().toISOString()}.csv`);
    }
  }, [logs]);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Log Viewer</h1>
          <p>View and filter database logs with advanced search capabilities</p>
        </header>

        {error && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24',
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <FilterPanel
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          totalLogs={totalCount}
          filteredLogs={logs.length}
        />

        <LogTable 
          logs={logs} 
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default App;
