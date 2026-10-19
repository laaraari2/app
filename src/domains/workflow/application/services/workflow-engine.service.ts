import { randomUUID } from 'crypto';
import {
  DomainEvent,
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowStepLog,
  WorkflowStepDefinition,
} from '../../domain/entities/event-types';
import { workflowRepository } from '../../infrastructure/persistence/workflow.repository';
import { eventBusService } from './event-bus.service';
import { auditService } from '../../../../services/audit.service';

export type StepActionHandler = (
  event: DomainEvent,
  context: Record<string, any>
) => Promise<Record<string, any> | void>;

export type StepConditionEvaluator = (
  event: DomainEvent,
  context: Record<string, any>
) => boolean | Promise<boolean>;

export class WorkflowEngineService {
  private actionRegistry: Map<string, StepActionHandler> = new Map();
  private conditionRegistry: Map<string, StepConditionEvaluator> = new Map();

  constructor() {
    // Automatically attach workflow engine to event bus
    eventBusService.registerWorkflowTrigger(async (event: DomainEvent) => {
      await this.executeWorkflowForEvent(event);
    });
  }

  public registerActionHandler(actionKey: string, handler: StepActionHandler): void {
    this.actionRegistry.set(actionKey, handler);
  }

  public registerConditionEvaluator(conditionKey: string, evaluator: StepConditionEvaluator): void {
    this.conditionRegistry.set(conditionKey, evaluator);
  }

  public async createDefinition(
    def: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkflowDefinition> {
    const now = new Date().toISOString();
    const workflowDef: WorkflowDefinition = {
      id: randomUUID(),
      ...def,
      createdAt: now,
      updatedAt: now,
    };
    return await workflowRepository.saveDefinition(workflowDef);
  }

  public async executeWorkflowForEvent(event: DomainEvent): Promise<WorkflowExecution[]> {
    const definitions = await workflowRepository.getActiveDefinitionsByEvent(
      event.tenantId,
      event.eventType
    );

    const executions: WorkflowExecution[] = [];

    for (const def of definitions) {
      const execution = await this.executeWorkflow(def, event);
      executions.push(execution);
    }

    return executions;
  }

  public async executeWorkflow(
    definition: WorkflowDefinition,
    event: DomainEvent
  ): Promise<WorkflowExecution> {
    const executionId = randomUUID();
    const now = new Date().toISOString();

    const execution: WorkflowExecution = {
      executionId,
      workflowCode: definition.code,
      tenantId: event.tenantId,
      correlationId: event.correlationId,
      eventId: event.eventId,
      status: 'RUNNING',
      currentStepIndex: 0,
      context: { triggerEventPayload: event.payload },
      logs: [],
      startedAt: now,
    };

    let workflowFailed = false;

    for (let i = 0; i < definition.steps.length; i++) {
      execution.currentStepIndex = i;
      const step = definition.steps[i];

      // 1. Evaluate Step Condition (if any)
      const shouldRun = await this.evaluateCondition(step, event, execution.context);
      if (!shouldRun) {
        execution.logs.push({
          stepId: step.stepId,
          stepName: step.name,
          status: 'SKIPPED',
          timestamp: new Date().toISOString(),
        });
        continue;
      }

      // 2. Execute Step Action with Retry Policy
      const maxRetries = step.retryPolicy?.maxRetries || 0;
      const backoffMs = step.retryPolicy?.backoffMs || 100;
      let attempt = 0;
      let stepSuccess = false;
      let lastError: Error | null = null;

      while (attempt <= maxRetries && !stepSuccess) {
        attempt++;
        try {
          const actionFn = step.actionFn || this.actionRegistry.get(step.actionKey);
          if (!actionFn) {
            throw new Error(`Action handler '${step.actionKey}' for step '${step.name}' not found`);
          }

          const result = await actionFn(event, execution.context);
          if (result && typeof result === 'object') {
            execution.context = { ...execution.context, ...result };
          }

          execution.logs.push({
            stepId: step.stepId,
            stepName: step.name,
            status: 'SUCCESS',
            output: result || { ok: true },
            attempt,
            timestamp: new Date().toISOString(),
          });

          stepSuccess = true;
        } catch (err: any) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (attempt <= maxRetries) {
            execution.logs.push({
              stepId: step.stepId,
              stepName: step.name,
              status: 'RETRIED',
              error: lastError.message,
              attempt,
              timestamp: new Date().toISOString(),
            });
            await new Promise(res => setTimeout(res, backoffMs * Math.pow(2, attempt - 1)));
          }
        }
      }

      if (!stepSuccess) {
        workflowFailed = true;
        execution.logs.push({
          stepId: step.stepId,
          stepName: step.name,
          status: 'FAILED',
          error: lastError?.message || 'Step execution failed',
          attempt,
          timestamp: new Date().toISOString(),
        });

        // Trigger onFailure callback if specified
        if (step.onFailureFn) {
          try {
            await step.onFailureFn(lastError || new Error('Step failed'), event, execution.context);
          } catch (onFailErr) {
            console.error(`⚠️ [WorkflowEngine] Step onFailureFn error:`, onFailErr);
          }
        }

        break; // Halt workflow execution on failure
      }
    }

    execution.status = workflowFailed ? 'FAILED' : 'COMPLETED';
    execution.completedAt = new Date().toISOString();

    await workflowRepository.saveExecution(execution);

    // Audit integration
    await auditService.logAction({
      tenantId: execution.tenantId,
      actorId: event.actor.userId || 'system',
      actorEmail: event.actor.userEmail || 'system@eduvora.internal',
      action: `WORKFLOW:${execution.workflowCode}:${execution.status}`,
      resource: 'WORKFLOW_ENGINE',
      targetId: execution.executionId,
      changes: { logsCount: execution.logs.length, finalStatus: execution.status },
    });

    return execution;
  }

  private async evaluateCondition(
    step: WorkflowStepDefinition,
    event: DomainEvent,
    context: Record<string, any>
  ): Promise<boolean> {
    if (step.conditionFn) {
      return await step.conditionFn(event, context);
    }
    if (step.conditionKey) {
      const evaluator = this.conditionRegistry.get(step.conditionKey);
      if (evaluator) {
        return await evaluator(event, context);
      }
    }
    return true; // Default to true if no condition defined
  }
}

export const workflowEngineService = new WorkflowEngineService();
