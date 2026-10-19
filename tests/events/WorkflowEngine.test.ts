import { describe, it, expect, vi } from 'vitest';
import { WorkflowEngine, WorkflowContext, WorkflowStep } from '../../src/domains/workflow/engine/WorkflowEngine';

describe('WorkflowEngine', () => {
    it('should execute steps sequentially', async () => {
        const engine = new WorkflowEngine();

        const step1: WorkflowStep = {
            name: 'Step 1',
            execute: vi.fn().mockResolvedValue(undefined),
        };
        const step2: WorkflowStep = {
            name: 'Step 2',
            execute: vi.fn().mockResolvedValue(undefined),
        };

        const context: WorkflowContext = {
            workflowId: 'wf-1',
            tenantId: 'tenant-1',
            correlationId: 'corr-1',
            state: {},
            status: 'RUNNING',
            currentStepIndex: 0,
        };

        await engine.startWorkflow('wf-1', [step1, step2], context);

        expect(step1.execute).toHaveBeenCalledTimes(1);
        expect(step2.execute).toHaveBeenCalledTimes(1);
        expect(context.status).toBe('COMPLETED');
    });

    it('should handle failures and trigger compensation', async () => {
        const engine = new WorkflowEngine();

        const step1: WorkflowStep = {
            name: 'Step 1',
            execute: vi.fn().mockResolvedValue(undefined),
            compensate: vi.fn().mockResolvedValue(undefined),
        };
        const step2: WorkflowStep = {
            name: 'Step 2',
            execute: vi.fn().mockRejectedValue(new Error('Failed')),
            compensate: vi.fn().mockResolvedValue(undefined),
        };

        const context: WorkflowContext = {
            workflowId: 'wf-1',
            tenantId: 'tenant-1',
            correlationId: 'corr-1',
            state: {},
            status: 'RUNNING',
            currentStepIndex: 0,
        };

        await engine.startWorkflow('wf-1', [step1, step2], context);

        expect(step1.execute).toHaveBeenCalledTimes(1);
        expect(step2.execute).toHaveBeenCalledTimes(1);
        expect(step2.compensate).toHaveBeenCalledTimes(1);
        expect(step1.compensate).toHaveBeenCalledTimes(1);
        expect(context.status).toBe('FAILED');
    });
});
