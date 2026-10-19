export interface WorkflowContext {
    workflowId: string;
    tenantId: string;
    correlationId: string;
    state: Record<string, any>;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRIED';
    currentStepIndex: number;
}

export interface WorkflowStep {
    name: string;
    execute(context: WorkflowContext): Promise<void>;
    compensate?(context: WorkflowContext): Promise<void>;
    condition?(context: WorkflowContext): boolean;
    retryPolicy?: {
        maxRetries: number;
        delayMs: number;
    };
}

export interface IWorkflowEngine {
    startWorkflow(workflowId: string, steps: WorkflowStep[], context: WorkflowContext): Promise<void>;
    executeStep(step: WorkflowStep, context: WorkflowContext): Promise<void>;
    handleFailure(error: Error, steps: WorkflowStep[], context: WorkflowContext): Promise<void>;
}

export class WorkflowEngine implements IWorkflowEngine {
    public async startWorkflow(workflowId: string, steps: WorkflowStep[], context: WorkflowContext): Promise<void> {
        context.status = 'RUNNING';
        context.currentStepIndex = 0;

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            context.currentStepIndex = i;

            if (step.condition && !step.condition(context)) {
                continue; // Skip step if condition is not met
            }

            try {
                await this.executeStep(step, context);
            } catch (error) {
                await this.handleFailure(error as Error, steps, context);
                return; // Stop workflow on failure
            }
        }

        context.status = 'COMPLETED';
        await this.notifyHooks(context);
    }

    public async executeStep(step: WorkflowStep, context: WorkflowContext): Promise<void> {
        let retries = 0;
        const maxRetries = step.retryPolicy?.maxRetries || 0;
        const delayMs = step.retryPolicy?.delayMs || 1000;

        while (true) {
            try {
                await step.execute(context);
                await this.auditLog(step.name, 'SUCCESS', context);
                return;
            } catch (error) {
                retries++;
                if (retries > maxRetries) {
                    await this.auditLog(step.name, 'FAILED', context);
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    }

    public async handleFailure(error: Error, steps: WorkflowStep[], context: WorkflowContext): Promise<void> {
        context.status = 'FAILED';

        // Compensating transactions (reverse order)
        for (let i = context.currentStepIndex; i >= 0; i--) {
            const step = steps[i];
            if (step.compensate) {
                try {
                    await step.compensate(context);
                    await this.auditLog(step.name, 'COMPENSATED', context);
                } catch (compError) {
                    await this.auditLog(step.name, 'COMPENSATION_FAILED', context);
                    // Log critical failure, manual intervention required
                }
            }
        }
        await this.notifyHooks(context);
    }

    private async auditLog(stepName: string, status: string, context: WorkflowContext): Promise<void> {
        // In a real implementation, this would write to an audit log database
        console.log(`[AUDIT] Workflow: ${context.workflowId}, Step: ${stepName}, Status: ${status}`);
    }

    private async notifyHooks(context: WorkflowContext): Promise<void> {
        // In a real implementation, this would trigger webhooks or notifications
        console.log(`[NOTIFICATION] Workflow: ${context.workflowId} finished with status: ${context.status}`);
    }
}
