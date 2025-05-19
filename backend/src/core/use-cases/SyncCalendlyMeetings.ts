// core/use-cases/SyncCalendlyMeetings.ts
import { AppDataSource } from "../../infrastructure/database/db";
import { Expert } from "../entities/Expert.entity";
import { ICalendlyRepository } from "../repositories/CalendlyRepository";
import { IMeetingRepository } from "../repositories/MeetingRepository";

export class SyncCalendlyMeetingsUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
    private calendlyRepo: ICalendlyRepository,
  ) {}

  async execute(expertId: number): Promise<void> {
    const token = await this.calendlyRepo.getAccessToken(expertId);
    const userUri = await this.calendlyRepo.getUserUri(token);
    const meetings = await this.calendlyRepo.getMeetings(token, userUri);

    for (const meeting of meetings) {
      const existing = await this.meetingRepo.findByEventId(meeting.eventId);
if (!existing) {
  const expertRepo = AppDataSource.getRepository(Expert);
const expert = await expertRepo.findOneBy({ id: expertId });
if (!expert) throw new Error("Expert not found");

meeting.expert = expert;
  await this.meetingRepo.save(meeting);
}
    }
  }
}
