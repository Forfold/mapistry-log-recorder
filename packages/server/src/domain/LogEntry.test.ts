import { ValidationError } from '../shared/errors';
import { LogEntry } from './entities/LogEntry';

const validProps = {
  logDate: new Date('2024-01-01'),
  logValue: 42,
  logId: 'log-1',
};

describe('LogEntry', () => {
  describe('create validation', () => {
    it('creates a log entry with valid props', () => {
      const entry = LogEntry.create(validProps);
      expect(entry.logDate).toEqual(validProps.logDate);
      expect(entry.logValue).toEqual(validProps.logValue);
      expect(entry.logId).toEqual(validProps.logId);
    });

    it('assigns an id on creation', () => {
      const entry = LogEntry.create(validProps);
      expect(entry.id.value).toBeDefined();
    });

    it('throws a ValidationError when logValue is not a number', () => {
      expect(() =>
        LogEntry.create({ ...validProps, logValue: 'bad' as unknown as number }),
      ).toThrow(ValidationError);
    });
  });

  describe('createFromPersistence', () => {
    it('restores a log entry with the given id', () => {
      const id = 'existing-uuid';
      const entry = LogEntry.createFromPersistence(validProps, id);
      expect(entry.id.value).toBe(id);
      expect(entry.logValue).toBe(validProps.logValue);
    });
  });
});
