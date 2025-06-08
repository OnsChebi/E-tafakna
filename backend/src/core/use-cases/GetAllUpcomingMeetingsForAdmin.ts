import { Meeting } from "../entities/Meeting.entity";
import { IMeetingRepository } from "../repositories/MeetingRepository";

export class GetAllUpcomingMeetingsForAdminUseCase {
  constructor(private meetingRepo: IMeetingRepository) {}


  async execute(): Promise<Meeting[]> {
    return await this.meetingRepo.findAllUpcomingMeetings();
  }

}
