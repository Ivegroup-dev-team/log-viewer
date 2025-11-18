// Type definitions for Log data structure

export interface LogEntry {
  ID: number;
  Logged: string;
  EventKey: string;
  Application: string;
  AppKey: string;
  Module: string;
  Action: string;
  Stage: string;
  Message: string;
  LogLevel: LogLevel;
  Audit: string;
  MQMessage: string;
  Exception: string | null;
  StackTrace: string | null;
  SiteName: string;
  MachineName: string;
  UserName: string;
  CallSite: string;
  RemoteAddress: string;
  ProcessID: number;
  Logger: string;
  Properties: string;
  ServerName: string;
  ServerAddress: string;
  Port: number;
  Url: string;
  Https: string;
  Process: string;
  Context: string;
  Timing: number;
  Settings: string;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface LogFilters {
  eventKey: string;
  application: string;
  startDate: string;
  endDate: string;
}

export interface PaginationResult<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
}
