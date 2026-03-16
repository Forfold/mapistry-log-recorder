import { ValidationError } from '../../shared/errors';
import { Entity } from './Entity';
import { Uuid } from './Uuid';

interface LogEntryProps {
  logDate: Date;
  logValue: number;
  logId: string;
}

type CreateLogEntryProps = LogEntryProps;

export class LogEntry extends Entity<LogEntryProps> {
  static createFromPersistence(props: LogEntryProps, id: string) {
    if (!this.isValid(props)) {
      throw new ValidationError(
        'Cannot create log entry. Props are not valid.',
      );
    }
    return new LogEntry(props, Uuid.create(id));
  }

  static create(createLogEntryProps: CreateLogEntryProps) {
    if (!this.isValid(createLogEntryProps)) {
      throw new ValidationError(
        'Cannot create log entry. Props are not valid.',
      );
    }
    return new LogEntry(createLogEntryProps);
  }

  private static isValid(createLogEntryProps: CreateLogEntryProps): boolean {
    return (
      typeof createLogEntryProps.logValue === 'number' &&
      Number.isFinite(createLogEntryProps.logValue) &&
      createLogEntryProps.logDate instanceof Date &&
      !Number.isNaN(createLogEntryProps.logDate.getTime())
    );
  }

  get logDate() {
    return this.props.logDate;
  }

  get logValue() {
    return this.props.logValue;
  }

  get logId() {
    return this.props.logId;
  }
}
