import { IEventBus } from '../core/EventBus';
import { IDomainEvent } from '../core/DomainEvent';
import { IEventHandler } from '../core/EventHandler';

export class InMemoryEventBus implements IEventBus {
    private handlers: Map<string, IEventHandler[]> = new Map();

    public async publish(event: IDomainEvent): Promise<void> {
        const eventName = event.constructor.name;
        const eventHandlers = this.handlers.get(eventName);

        if (eventHandlers) {
            const promises = eventHandlers.map((handler) => handler.handle(event));
            await Promise.allSettled(promises);
        }
    }

    public subscribe<T extends IDomainEvent>(eventName: string, handler: IEventHandler<T>): void {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        this.handlers.get(eventName)!.push(handler as IEventHandler);
    }

    public unsubscribe<T extends IDomainEvent>(eventName: string, handler: IEventHandler<T>): void {
        const eventHandlers = this.handlers.get(eventName);
        if (eventHandlers) {
            const index = eventHandlers.indexOf(handler as IEventHandler);
            if (index > -1) {
                eventHandlers.splice(index, 1);
            }
        }
    }
}

export const inMemoryEventBus = new InMemoryEventBus();
