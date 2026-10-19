import assert from 'assert';
import { randomUUID } from 'crypto';
import { eventBusService } from '../src/domains/workflow/application/services/event-bus.service';
import { outboxService } from '../src/domains/workflow/application/services/outbox.service';
import { outboxRepository } from '../src/domains/workflow/infrastructure/persistence/outbox.repository';
import { workflowRepository } from '../src/domains/workflow/infrastructure/persistence/workflow.repository';
import { workflowEngineService } from '../src/domains/workflow/application/services/workflow-engine.service';

import { DomainEvent, StandardEventType } from '../src/domains/workflow/domain/entities/event-types';

export async function runWorkflowDomainTests() {
  console.log('🧪 Starting Workflow & Domain Events Architecture Verification Tests...');

  const tenantId = `tenant-event-test-${Date.now()}`;
  const correlationId = randomUUID();

  // Reset handlers before running
  eventBusService.clearHandlers();

  // --- 1. Testing Standard Domain Event Payload Schema & Bus Publishing ---
  console.log('1. Testing Standard Domain Event Envelope & Bus Dispatching...');
  let receivedEvent: DomainEvent | null = null;

  eventBusService.subscribe('ApplicantAccepted', 'onApplicantAcceptedTestHandler', async (event) => {
    receivedEvent = event;
  });

  const publishedEvent = await eventBusService.publish({
    eventType: 'ApplicantAccepted',
    tenantId,
    correlationId,
    actor: { userId: 'user-admin-1', userEmail: 'admin@school.ma', userRole: 'SCHOOL_ADMIN' },
    payload: {
      applicantId: 'APP-2026-0001',
      studentName: 'Yassine El Mansouri',
      gradeLevelId: 'GRADE-9',
      acceptedAt: new Date().toISOString(),
    },
  });

  assert.ok(publishedEvent.eventId, 'Event ID must be generated');
  assert.strictEqual(publishedEvent.tenantId, tenantId);
  assert.strictEqual(publishedEvent.correlationId, correlationId);
  assert.ok(publishedEvent.timestamp, 'Timestamp must be present');
  assert.strictEqual(publishedEvent.actor.userRole, 'SCHOOL_ADMIN');
  assert.strictEqual(publishedEvent.status, 'COMPLETED');

  assert.ok(receivedEvent, 'Handler should have received event');
  assert.strictEqual((receivedEvent as any)?.payload?.applicantId, 'APP-2026-0001');
  console.log('  ✓ Domain event published and handled with standard envelope metadata.');

  // --- 2. Testing Event Idempotency & Duplicate Suppression ---
  console.log('2. Testing Event Idempotency & Duplicate Suppression...');
  let handlerCallCount = 0;
  const uniqueEventId = randomUUID();

  eventBusService.subscribe('StudentEnrolled', 'onStudentEnrolledDedupeHandler', async () => {
    handlerCallCount++;
  });

  const firstCall = await eventBusService.publish({
    eventId: uniqueEventId,
    eventType: 'StudentEnrolled',
    tenantId,
    correlationId,
    actor: { userId: 'user-admin-1' },
    payload: { studentNumber: 'STU-2026-0010' },
  });

  const duplicateCall = await eventBusService.publish({
    eventId: uniqueEventId,
    eventType: 'StudentEnrolled',
    tenantId,
    correlationId,
    actor: { userId: 'user-admin-1' },
    payload: { studentNumber: 'STU-2026-0010' },
  });

  assert.strictEqual(firstCall.status, 'COMPLETED');
  assert.strictEqual(duplicateCall.status, 'COMPLETED');
  assert.strictEqual(handlerCallCount, 1, 'Handler should be called exactly once due to idempotency deduplication');
  console.log('  ✓ Duplicate events suppressed cleanly via idempotency guarantees.');

  // --- 3. Testing Outbox Pattern & Asynchronous Processor ---
  console.log('3. Testing Outbox Pattern & Async Outbox Processor...');
  let outboxHandled = false;

  eventBusService.subscribe('AcademicYearActivated', 'onAcademicYearActivatedHandler', async (evt) => {
    if (evt.payload.academicYearCode === '2026-2027') {
      outboxHandled = true;
    }
  });

  const outboxResult = await eventBusService.publishWithOutbox({
    eventType: 'AcademicYearActivated',
    tenantId,
    correlationId: randomUUID(),
    actor: { userId: 'user-admin-1' },
    payload: { academicYearCode: '2026-2027', activatedBy: 'Karim Alami' },
  });

  assert.strictEqual(outboxResult.outboxMessage.status, 'PENDING');
  assert.strictEqual(outboxHandled, false, 'Handler should not fire until outbox processing');

  const processResult = await outboxService.processPendingOutbox(tenantId);
  assert.strictEqual(processResult.processed, 1);
  assert.strictEqual(outboxHandled, true, 'Outbox flush should publish event to handlers');

  const updatedOutboxMsg = await outboxRepository.findById(outboxResult.outboxMessage.id);
  assert.strictEqual(updatedOutboxMsg?.status, 'PROCESSED');
  console.log('  ✓ Outbox pattern transactional persistence and flush processor verified.');

  // --- 4. Testing Sequential & Conditional Workflow Engine ---
  console.log('4. Testing Sequential & Conditional Workflow Engine...');
  const workflowDef = await workflowEngineService.createDefinition({
    tenantId,
    code: 'ONBOARDING_WORKFLOW',
    name: 'Student Onboarding Workflow',
    description: 'Triggered when an applicant is accepted',
    triggerEventType: 'ApplicantAccepted',
    isActive: true,
    steps: [
      {
        stepId: 'step-1-create-account',
        name: 'Create Student Account',
        actionKey: 'action_create_account',
        actionFn: async (event) => {
          return { createdUserAccountId: `ACC-${event.payload.applicantId}` };
        },
      },
      {
        stepId: 'step-2-conditional-scholarship',
        name: 'Grant Entrance Scholarship',
        conditionFn: async (event) => {
          return event.payload.grantScholarship === true;
        },
        actionKey: 'action_grant_scholarship',
        actionFn: async () => {
          return { scholarshipGranted: true };
        },
      },
      {
        stepId: 'step-3-issue-welcome-kit',
        name: 'Issue Welcome Kit',
        actionKey: 'action_issue_welcome',
        actionFn: async (event, context) => {
          assert.ok(context.createdUserAccountId, 'Context from step 1 must be available');
          return { welcomeKitSent: true };
        },
      },
    ],
  });

  // Trigger event without scholarship (step 2 should be SKIPPED)
  await eventBusService.publish({
    eventType: 'ApplicantAccepted',
    tenantId,
    correlationId: randomUUID(),
    actor: { userId: 'admin' },
    payload: {
      applicantId: 'APP-2026-9999',
      grantScholarship: false,
    },
  });

  const executions = await workflowRepository.getExecutionsForTenant(tenantId);
  assert.ok(executions.length > 0, 'Workflow execution should be recorded');
  const execution = executions[0];

  assert.strictEqual(execution.workflowCode, 'ONBOARDING_WORKFLOW');
  assert.strictEqual(execution.status, 'COMPLETED');
  assert.strictEqual(execution.logs.length, 3);
  assert.strictEqual(execution.logs[0].status, 'SUCCESS');
  assert.strictEqual(execution.logs[1].status, 'SKIPPED', 'Step 2 should be skipped due to condition evaluation');
  assert.strictEqual(execution.logs[2].status, 'SUCCESS');
  assert.strictEqual(execution.context.createdUserAccountId, 'ACC-APP-2026-9999');
  console.log('  ✓ Sequential workflow execution, step context sharing, and conditional skipping verified.');

  // --- 5. Testing Retry Strategy & Exponential Backoff ---
  console.log('5. Testing Retry Strategy & Exponential Backoff...');
  let attemptCounter = 0;

  const retryWorkflowDef = await workflowEngineService.createDefinition({
    tenantId,
    code: 'PAYMENT_WORKFLOW',
    name: 'Payment Processing Workflow',
    triggerEventType: 'PaymentReceived',
    isActive: true,
    steps: [
      {
        stepId: 'step-1-charge',
        name: 'Process Payment Gateway Charge',
        actionKey: 'action_charge_gateway',
        retryPolicy: { maxRetries: 2, backoffMs: 10 },
        actionFn: async () => {
          attemptCounter++;
          if (attemptCounter < 2) {
            throw new Error('Transient network timeout at payment gateway');
          }
          return { paymentStatus: 'SETTLED' };
        },
      },
    ],
  });

  await eventBusService.publish({
    eventType: 'PaymentReceived',
    tenantId,
    correlationId: randomUUID(),
    actor: { userId: 'finance-admin' },
    payload: { invoiceId: 'INV-1001', amount: 1500 },
  });

  const paymentExecutions = await workflowRepository.getExecutionsForTenant(tenantId);
  const paymentExec = paymentExecutions.find(e => e.workflowCode === 'PAYMENT_WORKFLOW');
  assert.ok(paymentExec);
  assert.strictEqual(paymentExec.status, 'COMPLETED');
  assert.strictEqual(attemptCounter, 2, 'Should succeed on retry attempt 2');
  console.log('  ✓ Step retry policy and exponential backoff recovery verified.');

  // --- 6. Testing Failure Handling & Fallback Routines ---
  console.log('6. Testing Failure Handling & Fallback Routines...');
  let fallbackExecuted = false;

  await workflowEngineService.createDefinition({
    tenantId,
    code: 'FAILING_WORKFLOW',
    name: 'Failing Workflow Test',
    triggerEventType: 'RoleUpdated',
    isActive: true,
    steps: [
      {
        stepId: 'step-1-failing',
        name: 'Broken External Dependency Step',
        actionKey: 'action_broken',
        retryPolicy: { maxRetries: 1, backoffMs: 10 },
        actionFn: async () => {
          throw new Error('Fatal integration error');
        },
        onFailureFn: async (error) => {
          assert.strictEqual(error.message, 'Fatal integration error');
          fallbackExecuted = true;
        },
      },
    ],
  });

  await eventBusService.publish({
    eventType: 'RoleUpdated',
    tenantId,
    correlationId: randomUUID(),
    actor: { userId: 'system' },
    payload: { roleId: 'ROLE-1' },
  });

  const failExecutions = await workflowRepository.getExecutionsForTenant(tenantId);
  const failExec = failExecutions.find(e => e.workflowCode === 'FAILING_WORKFLOW');
  assert.ok(failExec);
  assert.strictEqual(failExec.status, 'FAILED');
  assert.strictEqual(fallbackExecuted, true, 'onFailureFn fallback routine should execute');
  console.log('  ✓ Workflow failure detection and fallback handler routines verified.');

  // --- 7. Testing Event Logs & Audit Retrieval ---
  console.log('7. Testing Domain Event Trail Logging...');
  const logs = await outboxRepository.getEventLogs(tenantId);
  assert.ok(logs.length >= 5, 'Event trail should log all dispatched events');
  console.log(`  ✓ Recorded ${logs.length} domain event log entries for audit trail.`);

  console.log('✅ ALL WORKFLOW & DOMAIN EVENTS ARCHITECTURE TESTS PASSED SUCCESSFULLY!\n');
}
