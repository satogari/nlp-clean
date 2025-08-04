import { InfrastructureError } from "../infrastructure.error";

export class DatabaseError extends InfrastructureError {
  constructor(originalError: Error | null = null) {
    super('Database failed', originalError);
    this.name = 'DatabaseError';
  }
}