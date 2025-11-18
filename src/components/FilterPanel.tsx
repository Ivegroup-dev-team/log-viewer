import React, { useState, useEffect } from 'react';
import { LogFilters } from '../types';
import { fetchApplications, DEFAULT_APPLICATIONS } from '../services/logService';
import { formatDateForInput, debounce } from '../utils/helpers';
import './FilterPanel.css';

interface FilterPanelProps {
  onFilterChange: (filters: LogFilters) => void;
  onExport: () => void;
  totalLogs: number;
  filteredLogs: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, onExport, totalLogs, filteredLogs }) => {
  const [eventKey, setEventKey] = useState<string>('');
  const [application, setApplication] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [applications, setApplications] = useState<string[]>(DEFAULT_APPLICATIONS);

  // Fetch available applications on mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const apps = await fetchApplications();
        if (apps && apps.length > 0) {
          setApplications(apps);
        }
      } catch (error) {
        console.error('Failed to load applications:', error);
        // Use default applications on error
      }
    };

    loadApplications();
  }, []);

  // Debounced filter change
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      onFilterChange({
        eventKey,
        application,
        startDate,
        endDate
      });
    }, 300);

    debouncedFilter();
  }, [eventKey, application, startDate, endDate, onFilterChange]);

  const handleReset = (): void => {
    setEventKey('');
    setApplication('');
    setStartDate('');
    setEndDate('');
  };

  const setLast7Days = (): void => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  };

  const setLast30Days = (): void => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  };

  return (
    <div className="filter-panel">
      <h2>Log Filters</h2>
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="eventKey">Event Key</label>
          <input
            id="eventKey"
            type="text"
            placeholder="Search by Event Key..."
            value={eventKey}
            onChange={(e) => setEventKey(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="application">Application</label>
          <select
            id="application"
            value={application}
            onChange={(e) => setApplication(e.target.value)}
          >
            <option value="">All Applications</option>
            {applications.map(app => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset Filters
        </button>
        <button className="btn btn-primary" onClick={setLast7Days}>
          Last 7 Days
        </button>
        <button className="btn btn-primary" onClick={setLast30Days}>
          Last 30 Days
        </button>
        <button 
          className="btn btn-success" 
          onClick={onExport}
          disabled={filteredLogs === 0}
        >
          Export to CSV
        </button>
      </div>
      
      <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
        Showing {filteredLogs} of {totalLogs} logs
      </div>
    </div>
  );
};

export default FilterPanel;
