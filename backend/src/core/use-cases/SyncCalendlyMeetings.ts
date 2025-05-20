import { ICalendlyRepository } from "../repositories/CalendlyRepository";
import { IMeetingRepository } from "../repositories/MeetingRepository";
import { Meeting } from "../entities/Meeting.entity";
import { Expert } from "../entities/Expert.entity";
import { IExpertRepository } from "../repositories/expert.repository";

export class SyncCalendlyMeetingsUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
    private calendlyRepo: ICalendlyRepository,
    private expertRepo: IExpertRepository 
  ) {}

  async execute(expertId: number): Promise<void> {
    // Get expert once
    const expert: Expert | null = await this.expertRepo.findById(expertId);
    if (!expert) {
      throw new Error("Expert not found");
    }

    const token = await this.calendlyRepo.getAccessToken(expertId);
    const userUri = await this.calendlyRepo.getUserUri(token);
    const meetings: Meeting[] = await this.calendlyRepo.getMeetings(token, userUri);

    for (const meeting of meetings) {
      const existing = await this.meetingRepo.findByEventId(meeting.eventId);
      if (!existing) {
        meeting.expert = expert;
        await this.meetingRepo.save(meeting);
      }
    }
  }
}
