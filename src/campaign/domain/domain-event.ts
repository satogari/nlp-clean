export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventVersion: number;
  public readonly aggregateId: string;

  constructor(aggregateId: string, eventVersion: number = 1) {
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.eventVersion = eventVersion;
  }
}