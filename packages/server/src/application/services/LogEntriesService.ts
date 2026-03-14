import {
  CreateLogEntryRequest,
  LogEntryResponse,
  UpdateLogEntryRequest,
} from '@mapistry/take-home-challenge-shared';
import { LogEntriesQueryRepository } from '../../persistence/repositories/LogEntriesQueryRepository';
import { LogEntriesRepository } from '../../persistence/repositories/LogEntriesRepository';
import { LogEntriesApiMapper } from '../mappers/LogEntriesApiMapper';

export class LogEntriesService {
  getLogEntries(logId: string): Promise<LogEntryResponse[]> {
    const logEntryRepository = new LogEntriesQueryRepository();
    return logEntryRepository.findLogEntries(logId);
  }

  async createLogEntry(
    logId: string,
    createLogEntry: CreateLogEntryRequest,
  ): Promise<LogEntryResponse> {
    const mapper = new LogEntriesApiMapper();
    const logEntry = mapper.fromRequest(logId, createLogEntry);
    const repository = new LogEntriesRepository(logId);
    const newEntry = await repository.createLogEntry(logEntry);
    return mapper.toResponse(newEntry);
  }

  async editLogEntry(logId: string, logEntryId: string, updatedLogEntry: UpdateLogEntryRequest): Promise<LogEntryResponse> {
    const mapper = new LogEntriesApiMapper();
    const logEntry = mapper.fromUpdateRequest(logId, logEntryId, updatedLogEntry);
    const repository = new LogEntriesRepository(logId);
    const updatedEntry = await repository.updateLogEntry(logEntry)
    return mapper.toResponse(updatedEntry);
  }

  async deleteLogEntry(logId: string, logEntryId: string): Promise<string> {
    const logEntryRepository = new LogEntriesRepository(logId);
    const logEntry = await logEntryRepository.findById(logEntryId);
    return logEntryRepository.destroyLogEntry(logEntry);
  }
}
