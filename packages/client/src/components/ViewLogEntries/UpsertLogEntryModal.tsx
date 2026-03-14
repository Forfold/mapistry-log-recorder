import { CreateLogEntryRequest, UpdateLogEntryRequest } from '@mapistry/take-home-challenge-shared';
import { DateTime } from 'luxon';
import { useCallback, ReactNode } from 'react';
import styled from 'styled-components';

interface UpsertLogEntryModalProps {
  handleClose: () => void;
  handleCreate?: (logEntry: CreateLogEntryRequest) => void;
  handleEdit?: (logEntry: UpdateLogEntryRequest) => void;
  editInfo?: UpdateLogEntryRequest
}

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 20%;
`;

interface CloseButtonProps {
  type: string;
  onClick: () => void;
  children: ReactNode;
}

const CloseButton = styled.button<CloseButtonProps>`
  float: right;
`;

interface FormProps {
  onSubmit: (event: React.SyntheticEvent) => void;
  children: ReactNode;
}

const StyledForm = styled.form<FormProps>`
  display: flex;
  flex-direction: column;
  margin: 0.5rem;

  label {
    margin: 0.3rem;
    display: flex;
    flex-direction: column;
  }

  input {
    margin: 0.3rem 0;
  }
`;

const Header = styled.p`
  padding: 0.4rem;
  font-size: 1.2rem;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;

  button {
    margin-left: 0.3rem;
  }
`;

export function UpsertLogEntryModal({
  handleClose,
  handleCreate,
  handleEdit,
  editInfo,
}: UpsertLogEntryModalProps) {
  const type: 'create' | 'edit' = typeof handleEdit === 'function' ? 'edit' : 'create'

  const onCreateSubmit = useCallback((event: React.SyntheticEvent) => {
    if (type !== 'create' && typeof handleCreate !== 'function') return

    event.preventDefault();
    const target = event.target as typeof event.target & {
      logDate: { value: string };
      logValue: { value: string };
    };
    const logEntry = {
      logDate: new Date(target.logDate.value),
      logValue: parseInt(target.logValue.value, 10),
    };

    if (handleCreate) {
      handleCreate(logEntry);
    } else {
      throw new Error('create handler missing') // sanity check
    }
  }, [type, handleCreate])

  const onEditSubmit = useCallback((event: React.SyntheticEvent) => {
    if (type !== 'edit' && typeof handleEdit !== 'function') return

    event.preventDefault()
    const target = event.target as typeof event.target & {
        logDate: { value: string };
        logValue: { value: string };
    };
    const logEntry = {
      logDate: new Date(target.logDate.value),
      logValue: parseInt(target.logValue.value, 10),
    };

    if (handleEdit && editInfo) {
      handleEdit({
        id: editInfo.id,
        logId: editInfo.logId,
        ...logEntry,
      });
    } else {
      throw new Error('edit handler missing') // sanity check
    }
  }, [type, handleEdit, editInfo])
  
  const defaultDate = editInfo?.logDate
    ? DateTime.fromJSDate(new Date(editInfo?.logDate)).toFormat('yyyy-MM-dd') ?? undefined
    : undefined

  return (
    <Modal>
      <ModalContent>
        <CloseButton type="button" onClick={handleClose}>
          X
        </CloseButton>
        <Header>{type === 'create' ? 'Create' : 'Edit'} Log Entry</Header>
        <StyledForm
          onSubmit={type === 'create' ? onCreateSubmit : onEditSubmit}
        >
          <label htmlFor="logDate">
            Date:&nbsp;
            <input type="date" name="logDate" defaultValue={defaultDate} />
          </label>

          <label htmlFor="logValue">
            Value:&nbsp;
            <input type="text" name="logValue" defaultValue={editInfo?.logValue} />
          </label>
          <ButtonContainer>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </ButtonContainer>
        </StyledForm>
      </ModalContent>
    </Modal>
  );
}
