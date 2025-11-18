// API service for fetching logs from the backend
import { LogEntry, LogFilters } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface LogResponse {
  logs: LogEntry[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LogFilterRequest {
  eventKey?: string;
  application?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// Fetch filtered logs from API
export const fetchLogs = async (filters: LogFilters, page: number = 1, pageSize: number = 25): Promise<LogResponse> => {
  const request: LogFilterRequest = {
    page,
    pageSize,
  };

  if (filters.eventKey) {
    request.eventKey = filters.eventKey;
  }

  if (filters.application) {
    request.application = filters.application;
  }

  if (filters.startDate) {
    request.startDate = filters.startDate;
  }

  if (filters.endDate) {
    request.endDate = filters.endDate;
  }

  const response = await fetch(`${API_BASE_URL}/logs/filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }

  return response.json();
};

// Fetch available applications for filter dropdown
export const fetchApplications = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/logs/applications`);

  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }

  return response.json();
};

// Fetch logs by EventKey
export const fetchLogsByEventKey = async (eventKey: string): Promise<LogEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/logs/eventkey/${encodeURIComponent(eventKey)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch logs by EventKey');
  }

  return response.json();
};

// Fetch a single log by ID
export const fetchLogById = async (id: number): Promise<LogEntry> => {
  const response = await fetch(`${API_BASE_URL}/logs/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch log');
  }

  return response.json();
};

// Default applications (fallback if API call fails)
export const DEFAULT_APPLICATIONS = ['OrderService', 'PaymentService', 'InventoryService', 'UserService', 'NotificationService'];
