import { describe, it, expect, vi } from 'vitest';
import { InMemoryEventBus } from '../../src/lib/events/bus/InMemoryEventBus';
import { ApplicantAccepted } from '../../src/domains/workflow/events/DomainEvents';
import { IEventHandler } from '../../src/lib/events/core/EventHandler';

describe('InMemoryEventBus', () => {
    it('should route events to subscribed handlers', async () => {
        const bus = new InMemoryEventBus();
        const mockHandler: IEventHandler<ApplicantAccepted> = {
            handle: vi.fn().mockResolvedValue(undefined),
        };

        bus.subscribe('ApplicantAccepted', mockHandler);

        const event = new ApplicantAccepted('1', 'tenant-1', 'corr-1', 'actor-1', {
            applicantId: 'app-1',
            programId: 'prog-1',
        });

        await bus.publish(event);

        expect(mockHandler.handle).toHaveBeenCalledTimes(1);
        expect(mockHandler.handle).toHaveBeenCalledWith(event);
    });

    it('should not call handlers after they unsubscribe', async () => {
        const bus = new InMemoryEventBus();
        const mockHandler: IEventHandler<ApplicantAccepted> = {
            handle: vi.fn().mockResolvedValue(undefined),
        };

        bus.subscribe('ApplicantAccepted', mockHandler);
        bus.unsubscribe('ApplicantAccepted', mockHandler);

        const event = new ApplicantAccepted('1', 'tenant-1', 'corr-1', 'actor-1', {
            applicantId: 'app-1',
            programId: 'prog-1',
        });

        await bus.publish(event);

        expect(mockHandler.handle).not.toHaveBeenCalled();
    });
});
