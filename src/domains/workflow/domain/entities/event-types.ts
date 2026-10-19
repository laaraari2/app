export type StandardEventType =
  | 'ApplicantAccepted'
  | 'StudentEnrolled'
  | 'UserAccountCreated'
  | 'AcademicYearActivated'
  | 'TeacherAssigned'
  | 'InvoiceGenerated'
  | 'PaymentReceived'
  | 'AttendanceRecorded'
  | 'PasswordChanged'
  | 'RoleUpdated'
  | (string & {});

export type EventStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRIED';

export interface EventActor {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

export interface DomainEvent<T = any> {
  eventId: string;
  eventType: StandardEventType;
  tenantId: string;
  correlationId: string;
  timestamp: string;
  actor: EventActor;
  payload: T;
  status: EventStatus;
  version?: number;
}

export type OutboxStatus = 'PENDING' | 'PROCESSED' | 'FAILED';

export interface OutboxMessage {
  id: string;
  tenantId: string;
  event: DomainEvent;
  status: OutboxStatus;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  error?: string;
  createdAt: string;
  processedAt?: string;
}

export interface WorkflowStepDefinition {
  stepId: string;
  name: string;
  conditionKey?: string;
  conditionFn?: (event: DomainEvent, context: Record<string, any>) => boolean | Promise<boolean>;
  actionKey: string;
  actionFn?: (event: DomainEvent, context: Record<string, any>) => Promise<Record<string, any> | void>;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
  onFailureFn?: (error: Error, event: DomainEvent, context: Record<string, any>) => Promise<void>;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  triggerEventType: StandardEventType;
  isActive: boolean;
  steps: WorkflowStepDefinition[];
  createdAt: string;
  updatedAt: string;
}

export type WorkflowExecutionStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'COMPENSATED';

export interface WorkflowStepLog {
  stepId: string;
  stepName: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'RETRIED';
  output?: any;
  error?: string;
  attempt?: number;
  timestamp: string;
}

export interface WorkflowExecution {
  executionId: string;
  workflowCode: string;
  tenantId: string;
  correlationId: string;
  eventId: string;
  status: WorkflowExecutionStatus;
  currentStepIndex: number;
  context: Record<string, any>;
  logs: WorkflowStepLog[];
  startedAt: string;
  completedAt?: string;
}

export interface EventHandlerRegistration {
  id: string;
  eventType: StandardEventType;
  handlerName: string;
  handler: (event: DomainEvent) => Promise<void>;
  idempotent?: boolean;
}
