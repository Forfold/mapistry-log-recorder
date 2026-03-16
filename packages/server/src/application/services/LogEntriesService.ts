import {
  CreateLogEntryRequest,
  LogEntryResponse,
  UpdateLogEntryRequest,
} from '@mapistry/take-home-challenge-shared';
import { LogEntriesQueryRepository } from '../../persistence/repositories/LogEntriesQueryRepository';
import { LogEntriesRepository } from '../../persistence/repositories/LogEntriesRepository';
import { ValidationError } from '../../shared/errors';
import { LogEntriesApiMapper } from '../mappers/LogEntriesApiMapper';

export class LogEntriesService {
  private static requireId(name: string, value?: string,) {
    if (!value) throw new ValidationError(`${name} is required`);
  }

  getLogEntries(logId: string): Promise<LogEntryResponse[]> {
    LogEntriesService.requireId('logId', logId);
    const logEntryRepository = new LogEntriesQueryRepository();
    return logEntryRepository.findLogEntries(logId);
  }

  async createLogEntry(
    logId: string,
    createLogEntry: CreateLogEntryRequest,
  ): Promise<LogEntryResponse> {
    LogEntriesService.requireId('logId', logId);
    if (!createLogEntry.logDate) {
      throw new ValidationError("logDate is required")
    }
    if (createLogEntry.logValue === undefined) {
      throw new ValidationError("logValue is required")
    }
    const mapper = new LogEntriesApiMapper();
    const logEntry = mapper.fromRequest(logId, createLogEntry);
    const repository = new LogEntriesRepository(logId);
    const newEntry = await repository.createLogEntry(logEntry);
    return mapper.toResponse(newEntry);
  }

  async editLogEntry(logId: string, logEntryId: string, updatedLogEntry: UpdateLogEntryRequest, fullReplace = false): Promise<LogEntryResponse> {
    LogEntriesService.requireId('logId', logId);
    LogEntriesService.requireId('logEntryId', logEntryId);
    if (fullReplace && !updatedLogEntry.logDate) {
      throw new ValidationError("logDate is required")
    }
    if (fullReplace && updatedLogEntry.logValue === undefined) {
      throw new ValidationError("logValue is required")
    }

    const mapper = new LogEntriesApiMapper();
    const repository = new LogEntriesRepository(logId);
    const currentLogEntry = await repository.findById(logEntryId);

    const logEntry = mapper.fromUpdateRequest(logId, logEntryId, updatedLogEntry.logDate ?? currentLogEntry.logDate, updatedLogEntry.logValue ?? currentLogEntry.logValue);
    const updatedEntry = await repository.updateLogEntry(logEntry)
    return mapper.toResponse(updatedEntry);
  }

  async deleteLogEntry(logId: string, logEntryId: string): Promise<string> {
    LogEntriesService.requireId('logId', logId);
    LogEntriesService.requireId('logEntryId', logEntryId);
    const logEntryRepository = new LogEntriesRepository(logId);
    const logEntry = await logEntryRepository.findById(logEntryId);
    return logEntryRepository.destroyLogEntry(logEntry);
  }
}
