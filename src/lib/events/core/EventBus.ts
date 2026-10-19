import { IDomainEvent } from './DomainEvent';
import { IEventHandler } from './EventHandler';

export interface IEventBus {
    publish(event: IDomainEvent): Promise<void>;
    subscribe<T extends IDomainEvent>(eventName: string, handler: IEventHandler<T>): void;
    unsubscribe<T extends IDomainEvent>(eventName: string, handler: IEventHandler<T>): void;
}
