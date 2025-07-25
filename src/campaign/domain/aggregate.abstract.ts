import { DomainEvent } from "./domain-event";

export abstract class AggregateRoot<T> {
  protected _id: T;
  private _domainEvents: DomainEvent[] = [];
  private _version: number = 0;

  constructor(id: T) {
    this._id = id;
  }

  get id(): T {
    return this._id;
  }

  get version(): number {
    return this._version;
  }

  protected raise(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  get domainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  incrementVersion(): void {
    this._version++;
  }
}
