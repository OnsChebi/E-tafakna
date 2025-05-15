import { ICalendlyRepository } from "../repositories/CalendlyRepository";

export class CancelMeetingUseCase {
  constructor(private calendlyRepo: ICalendlyRepository) {}

  async execute(expertId: number, eventUri: string, reason:string): Promise<void> {
    const token = await this.calendlyRepo.getAccessToken(expertId);
    await this.calendlyRepo.cancelMeeting(token, eventUri ,reason);
  }
}
