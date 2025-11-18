import React from 'react';
import { LogEntry } from '../types';
import { formatDate } from '../utils/helpers';
import './LogDetails.css';

interface LogDetailsProps {
  log: LogEntry;
}

const LogDetails: React.FC<LogDetailsProps> = ({ log }) => {
  const renderDetailItem = (label: string, value: string | number | null | undefined, className: string = ''): JSX.Element => {
    if (value === null || value === undefined || value === '') {
      return (
        <div className="detail-item" key={label}>
          <div className="detail-label">{label}</div>
          <div className="detail-value empty">N/A</div>
        </div>
      );
    }
    
    return (
      <div className="detail-item" key={label}>
        <div className="detail-label">{label}</div>
        <div className={`detail-value ${className}`}>{value}</div>
      </div>
    );
  };

  return (
    <div className="log-details">
      <h3>Log Details - ID: {log.ID}</h3>
      
      <div className="details-grid">
        <div className="section-title">Basic Information</div>
        {renderDetailItem('ID', log.ID)}
        {renderDetailItem('Logged', formatDate(log.Logged))}
        {renderDetailItem('Event Key', log.EventKey, 'monospace')}
        {renderDetailItem('Log Level', log.LogLevel)}
        {renderDetailItem('Stage', log.Stage)}
        
        <div className="section-title">Application Information</div>
        {renderDetailItem('Application', log.Application)}
        {renderDetailItem('App Key', log.AppKey)}
        {renderDetailItem('Module', log.Module)}
        {renderDetailItem('Action', log.Action)}
        {renderDetailItem('Call Site', log.CallSite)}
        {renderDetailItem('Logger', log.Logger)}
        {renderDetailItem('Process', log.Process)}
        
        <div className="section-title">Message & Details</div>
        {renderDetailItem('Message', log.Message)}
        {renderDetailItem('Audit', log.Audit)}
        {renderDetailItem('MQ Message', log.MQMessage)}
        {renderDetailItem('Context', log.Context)}
        {renderDetailItem('Timing (ms)', log.Timing)}
        
        {log.Exception && (
          <>
            <div className="section-title">Error Information</div>
            {renderDetailItem('Exception', log.Exception, 'error code')}
            {renderDetailItem('Stack Trace', log.StackTrace, 'code')}
          </>
        )}
        
        <div className="section-title">System Information</div>
        {renderDetailItem('Site Name', log.SiteName)}
        {renderDetailItem('Machine Name', log.MachineName)}
        {renderDetailItem('Server Name', log.ServerName)}
        {renderDetailItem('Server Address', log.ServerAddress)}
        {renderDetailItem('Remote Address', log.RemoteAddress)}
        {renderDetailItem('Port', log.Port)}
        {renderDetailItem('Process ID', log.ProcessID)}
        
        <div className="section-title">User & Request Information</div>
        {renderDetailItem('User Name', log.UserName)}
        {renderDetailItem('URL', log.Url)}
        {renderDetailItem('HTTPS', log.Https)}
        
        <div className="section-title">Additional Data</div>
        {renderDetailItem('Properties', log.Properties, 'code')}
        {renderDetailItem('Settings', log.Settings, 'code')}
      </div>
    </div>
  );
};

export default LogDetails;
