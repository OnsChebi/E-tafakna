import { ICalendlyRepository } from "../repositories/CalendlyRepository";
import { IMeetingRepository } from "../repositories/MeetingRepository";

export class CancelMeetingsUseCase {
  constructor(private meetingRepo: IMeetingRepository , private calendlyRepo : ICalendlyRepository) {}

  async execute(eventId: string, reason: string): Promise<void> {
    const meeting = await this.meetingRepo.findByEventId(eventId);
    if (!meeting) throw new Error("Meeting not found");
    if (!meeting.expert || !meeting.expert.accessToken) {
      throw new Error("Meeting expert or access token not found");
    }
    
    await this.calendlyRepo.cancelMeeting(meeting.expert.accessToken, meeting.eventId, reason);
    meeting.status = 'canceled';
    meeting.reason = reason;
    await this.meetingRepo.save(meeting);
  }
}
