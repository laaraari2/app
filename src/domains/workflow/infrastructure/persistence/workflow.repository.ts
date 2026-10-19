import { db } from '../../../../db/store';
import {
  WorkflowDefinition,
  WorkflowExecution,
  StandardEventType,
} from '../../domain/entities/event-types';

export class WorkflowRepository {
  public async saveDefinition(def: WorkflowDefinition): Promise<WorkflowDefinition> {
    db.workflowDefinitions.set(def.id, { ...def });
    return def;
  }

  public async getDefinitionById(id: string): Promise<WorkflowDefinition | null> {
    const def = db.workflowDefinitions.get(id);
    return def ? { ...def } : null;
  }

  public async getActiveDefinitionsByEvent(
    tenantId: string,
    eventType: StandardEventType
  ): Promise<WorkflowDefinition[]> {
    return Array.from(db.workflowDefinitions.values()).filter(
      d => d.tenantId === tenantId && d.triggerEventType === eventType && d.isActive
    );
  }

  public async saveExecution(exec: WorkflowExecution): Promise<WorkflowExecution> {
    db.workflowExecutions.set(exec.executionId, { ...exec });
    return exec;
  }

  public async getExecutionById(executionId: string): Promise<WorkflowExecution | null> {
    const exec = db.workflowExecutions.get(executionId);
    return exec ? { ...exec } : null;
  }

  public async getExecutionsForTenant(
    tenantId: string,
    limit: number = 50
  ): Promise<WorkflowExecution[]> {
    return Array.from(db.workflowExecutions.values())
      .filter(e => e.tenantId === tenantId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }
}

export const workflowRepository = new WorkflowRepository();
