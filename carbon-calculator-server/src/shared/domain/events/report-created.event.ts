export class ReportCreatedEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly reportId: string,
    occurredAt?: Date,
  ) {
    if (!reportId) throw new Error('reportId is required');
    this.occurredAt = occurredAt ?? new Date();
  }
}
