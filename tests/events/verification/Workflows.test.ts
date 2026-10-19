import { describe, it, expect, vi } from 'vitest';
import { InMemoryEventBus } from '../../../src/lib/events/bus/InMemoryEventBus';
import { MockHandlers } from './MockHandlers';
import { SchoolCreated, ApplicantCreated, EmployeeCreated } from './VerificationEvents';

describe('Business Flow Verification', () => {
    it('should execute the Tenant Provisioning Workflow end-to-end', async () => {
        const bus = new InMemoryEventBus();
        const handlers = new MockHandlers(bus);
        handlers.registerAll();

        // Spy on the final event handler
        const finalHandlerSpy = vi.spyOn(handlers.handleSetupWizardCompleted, 'handle');

        const initialEvent = new SchoolCreated('evt-1', 'tenant-1', 'corr-1', 'actor-1', { schoolId: 'school-1', name: 'Test School' });

        await bus.publish(initialEvent);

        // Wait for all async handlers to finish (in a real system this might need more robust waiting, but for in-memory this is often sufficient if promises are awaited properly in the bus)
        await new Promise(process.nextTick);

        expect(finalHandlerSpy).toHaveBeenCalledTimes(1);
        const finalEvent = finalHandlerSpy.mock.calls[0][0];
        expect(finalEvent.tenantId).toBe('tenant-1');
    });

    it('should execute the Admission Workflow end-to-end', async () => {
        const bus = new InMemoryEventBus();
        const handlers = new MockHandlers(bus);
        handlers.registerAll();

        const finalHandlerSpy = vi.spyOn(handlers.handleUserAccountCreated, 'handle');

        const initialEvent = new ApplicantCreated('evt-1', 'tenant-1', 'corr-1', 'actor-1', { applicantId: 'app-1' });

        await bus.publish(initialEvent);
        await new Promise(process.nextTick);

        expect(finalHandlerSpy).toHaveBeenCalledTimes(1);
        const finalEvent = finalHandlerSpy.mock.calls[0][0];
        expect(finalEvent.payload.userId).toBe('user-1');
    });

    it('should execute the Teacher Workflow end-to-end', async () => {
        const bus = new InMemoryEventBus();
        const handlers = new MockHandlers(bus);
        handlers.registerAll();

        const finalHandlerSpy = vi.spyOn(handlers.handleTeachingAssignmentLinked, 'handle');

        const initialEvent = new EmployeeCreated('evt-1', 'tenant-1', 'corr-1', 'actor-1', { employeeId: 'emp-1' });

        await bus.publish(initialEvent);
        await new Promise(process.nextTick);

        expect(finalHandlerSpy).toHaveBeenCalledTimes(1);
        const finalEvent = finalHandlerSpy.mock.calls[0][0];
        expect(finalEvent.payload.teacherId).toBe('teacher-1');
    });
});
