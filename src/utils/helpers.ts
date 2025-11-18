// Utility functions for formatting and data manipulation
import { LogEntry, LogLevel, PaginationResult } from '../types';

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get color for log level
export const getLogLevelColor = (logLevel: LogLevel): string => {
  switch (logLevel) {
    case 'DEBUG':
      return '#6c757d';
    case 'INFO':
      return '#0dcaf0';
    case 'WARNING':
      return '#ffc107';
    case 'ERROR':
      return '#dc3545';
    case 'CRITICAL':
      return '#8b0000';
    default:
      return '#6c757d';
  }
};

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout | null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout) clearTimeout(timeout);
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Export logs to CSV
export const exportToCSV = (logs: LogEntry[], filename: string = 'logs.csv'): void => {
  if (!logs || logs.length === 0) return;
  
  const headers = Object.keys(logs[0]) as (keyof LogEntry)[];
  const csvContent = [
    headers.join(','),
    ...logs.map(log => 
      headers.map(header => {
        const value = log[header];
        // Escape commas and quotes in values
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Paginate data
export const paginate = <T>(data: T[], page: number, pageSize: number): PaginationResult<T> => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    data: data.slice(startIndex, endIndex),
    totalPages: Math.ceil(data.length / pageSize),
    totalItems: data.length
  };
};

// Group logs by EventKey
export const groupLogsByEventKey = (logs: LogEntry[]): Record<string, LogEntry[]> => {
  const groups: Record<string, LogEntry[]> = {};
  logs.forEach(log => {
    if (!groups[log.EventKey]) {
      groups[log.EventKey] = [];
    }
    groups[log.EventKey].push(log);
  });
  return groups;
};
