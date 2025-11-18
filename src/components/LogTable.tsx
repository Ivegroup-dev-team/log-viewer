import React, { useState } from 'react';
import { LogEntry } from '../types';
import { formatDate, getLogLevelColor } from '../utils/helpers';
import LogDetails from './LogDetails';
import './LogTable.css';

interface LogTableProps {
  logs: LogEntry[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const LogTable: React.FC<LogTableProps> = ({ 
  logs, 
  loading, 
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (logId: number): void => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(logId)) {
      newExpandedRows.delete(logId);
    } else {
      newExpandedRows.add(logId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handlePageSizeChange = (newPageSize: string): void => {
    onPageSizeChange(Number(newPageSize));
    setExpandedRows(new Set());
  };

  if (loading) {
    return (
      <div className="log-table-container">
        <div className="loading-message">Loading logs...</div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="log-table-container">
        <div className="no-data-message">No logs found. Try adjusting your filters.</div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="log-table-container">
      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}></th>
              <th>ID</th>
              <th>Logged</th>
              <th>Log Level</th>
              <th>Application</th>
              <th>Module</th>
              <th>Action</th>
              <th>Message</th>
              <th>Event Key</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <React.Fragment key={log.ID}>
                <tr onClick={() => toggleRow(log.ID)}>
                  <td>
                    <span className={`expand-icon ${expandedRows.has(log.ID) ? 'expanded' : ''}`}>
                      ▶
                    </span>
                  </td>
                  <td>{log.ID}</td>
                  <td>{formatDate(log.Logged)}</td>
                  <td>
                    <span 
                      className="log-level-badge" 
                      style={{ backgroundColor: getLogLevelColor(log.LogLevel) }}
                    >
                      {log.LogLevel}
                    </span>
                  </td>
                  <td>{log.Application}</td>
                  <td>{log.Module}</td>
                  <td>{log.Action}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.Message}
                  </td>
                  <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {log.EventKey.substring(0, 8)}...
                  </td>
                </tr>
                {expandedRows.has(log.ID) && (
                  <tr className="details-row">
                    <td colSpan={9} className="details-cell">
                      <LogDetails log={log} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <div className="pagination-info">
          Showing {startIndex} to {endIndex} of {totalCount} logs
        </div>
        <div className="pagination-controls">
          <button 
            onClick={() => onPageChange(1)} 
            disabled={currentPage === 1}
          >
            First
          </button>
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button 
            onClick={() => onPageChange(totalPages)} 
            disabled={currentPage === totalPages}
          >
            Last
          </button>
          <select 
            value={pageSize} 
            onChange={(e) => handlePageSizeChange(e.target.value)}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default LogTable;
