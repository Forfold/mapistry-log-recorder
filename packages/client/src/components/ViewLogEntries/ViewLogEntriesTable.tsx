import { LogEntryResponse } from '@mapistry/take-home-challenge-shared';
import { useCallback } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { FetchLogEntriesResponse, deleteLogEntry } from '../../shared/apiClient/logsApi';

interface ViewLogEntriesTableProps {
  logEntries: FetchLogEntriesResponse;
  refreshLogEntries: () => void;
  setEditEntry: (logEntry: LogEntryResponse) => void
}

const StyledTable = styled.table`
  width: 100%;
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  th,
  td {
    padding: 1rem;
    text-align: center;
  }
  th {
    font-weight: 700;
    border-bottom: 1px solid;
  }
`;

export function ViewLogEntriesTable({ logEntries, refreshLogEntries, setEditEntry }: ViewLogEntriesTableProps) {
  const handleDelete = useCallback(
    async (logEntry: LogEntryResponse) => {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (confirm('Are you sure?')) {
        await deleteLogEntry(logEntry);
        refreshLogEntries();
      }
    },
    [refreshLogEntries],
  );

  function columns() {
    return (
      <thead>
        <tr>
          <th>Log Date</th>
          <th>Log Value</th>
          <th>Actions</th>
        </tr>
      </thead>
    );
  }

  function actions(logEntry: LogEntryResponse) {
    return (
      <div>
        <button type="button" style={{ marginRight: '0.5rem' }} onClick={() => setEditEntry(logEntry)}>
          Edit
        </button>
        <button type="button" onClick={() => handleDelete(logEntry)}>
          Delete
        </button>
      </div>
    );
  }

  function logEntryRow(logEntry: LogEntryResponse) {
    return (
      <tr key={logEntry.id}>
        <td>{DateTime.fromISO(String(logEntry.logDate), { zone: 'UTC' }).toFormat('MM/dd/yyyy')}</td>
        <td>{logEntry.logValue}</td>
        <td>{actions(logEntry)}</td>
      </tr>
    );
  }

  function rows() {
    return <tbody>{logEntries.map((logEntry) => logEntryRow(logEntry))}</tbody>;
  }

  return (
    <div>
      <StyledTable>
        {columns()}
        {rows()}
      </StyledTable>
    </div>
  );
}
