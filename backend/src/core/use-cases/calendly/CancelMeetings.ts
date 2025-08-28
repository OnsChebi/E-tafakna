import { ICalendlyRepository } from "../../repositories/CalendlyRepository";
import { IMeetingRepository } from "../../repositories/MeetingRepository";

export class CancelMeetingsUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
    private calendlyRepo: ICalendlyRepository
  ) {}

  async execute(expertId: number, eventUri: string, reason: string): Promise<void> {
    const token = await this.calendlyRepo.getAccessToken(expertId);
    await this.calendlyRepo.cancelMeeting(token, eventUri, reason);

    const eventId = eventUri;
    //console.log("Event ID to cancel:", eventId);
    if (!eventId) throw new Error("Invalid event URI");

    
    await this.meetingRepo.cancelMeeting(eventId ,reason);
  }
}
