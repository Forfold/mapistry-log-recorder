import { LogEntryResponse } from '@mapistry/take-home-challenge-shared';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLastVisitedLog } from '../../hooks/useLastVisitedLog';
import { useLogEntries } from '../../hooks/useLogEntries';
import { createLogEntry, editLogEntry } from '../../shared/apiClient/logsApi';
import { Error } from '../shared/Error';
import { Loading } from '../shared/Loading';
import { UpsertLogEntryModal } from './UpsertLogEntryModal';
import { ViewLogEntriesEmptyPage } from './ViewLogEntriesEmptyPage';
import { ViewLogEntriesHeader } from './ViewLogEntriesHeader';
import { ViewLogEntriesTable } from './ViewLogEntriesTable';

const Container = styled.div`
  height: 100vh;
`;

export function ViewLogEntries() {
  const { lastVisitedLog } = useLastVisitedLog();
  const { logEntries, error, isLoading, refreshLogEntries } = useLogEntries({
    logId: lastVisitedLog.id,
  });
  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<LogEntryResponse>();

  const handleAddNew = useCallback(async () => {
    setIsCreateEntryOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateEntryOpen(false);
  }, [setIsCreateEntryOpen]);

  const handleCreateLogEntry = useCallback(
    async (logEntry) => {
      await createLogEntry({ logId: lastVisitedLog.id, logEntry });
      handleCloseCreate();
      refreshLogEntries();
    },
    [handleCloseCreate, lastVisitedLog.id, refreshLogEntries],
  );

  const handleCloseEdit = useCallback(() => {
    setEditEntry(undefined);
  }, [setEditEntry]);

  const handleEditLogEntry = useCallback(async (logEntry: LogEntryResponse) => {
    await editLogEntry(logEntry)
    handleCloseEdit()
    refreshLogEntries();
  }, [handleCloseEdit, refreshLogEntries])

  function content() {
    if (isLoading) {
      return <Loading />;
    }
    if (error) {
      return (
        <Error message="Sorry, there was an error loading the log entries." />
      );
    }
    return logEntries.length ? (
      <ViewLogEntriesTable logEntries={logEntries} refreshLogEntries={refreshLogEntries} setEditEntry={setEditEntry}/>
    ) : (
      <ViewLogEntriesEmptyPage />
    );
  }

  return (
    <Container>
      {isCreateEntryOpen && (
        <UpsertLogEntryModal
          handleClose={handleCloseCreate}
          handleCreate={handleCreateLogEntry}
        />
      )}
      {editEntry && (
        <UpsertLogEntryModal
          handleClose={handleCloseEdit}
          handleEdit={handleEditLogEntry}
          editInfo={editEntry}
        />
      )}
      <ViewLogEntriesHeader
        onAddNew={handleAddNew}
        logName={lastVisitedLog.name}
      />
      {content()}
    </Container>
  );
}
