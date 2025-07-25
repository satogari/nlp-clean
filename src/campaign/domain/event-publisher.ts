import { DomainEvent } from "./domain-event";

export interface EventPublisher {
  /**
   * Publishes domain events to interested subscribers
   * Domain layer defines WHAT should happen when events are published
   */
  publish(events: readonly DomainEvent[]): Promise<void>;
  
  /**
   * Publishes a single domain event
   */
  publishSingle(event: DomainEvent): Promise<void>;
}

export const EventPublisher = Symbol('EventPublisher')