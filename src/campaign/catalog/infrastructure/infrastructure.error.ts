export class InfrastructureError extends Error {
  originalError: Error | null;
  constructor(message: string, originalError: Error | null = null) {
    super(message);
    this.name = 'InfrastructureError';
    this.originalError = originalError;
  }
}

