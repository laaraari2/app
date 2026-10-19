export interface DomainEvent {
  eventId: string;
  eventName: string;
  tenantId: string;
  aggregateId: string;
  aggregateType: 'school' | 'campus' | 'building' | 'floor' | 'room';
  payload: Record<string, any>;
  occurredAt: Date;
  actorId?: string;
  actorEmail?: string;
}

export class OrganizationEvents {
  public static createEvent(
    eventName: string,
    tenantId: string,
    aggregateId: string,
    aggregateType: 'school' | 'campus' | 'building' | 'floor' | 'room',
    payload: Record<string, any>,
    actorId?: string,
    actorEmail?: string
  ): DomainEvent {
    return {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      tenantId,
      aggregateId,
      aggregateType,
      payload,
      occurredAt: new Date(),
      actorId,
      actorEmail,
    };
  }
}
