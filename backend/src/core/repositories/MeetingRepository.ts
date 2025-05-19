// src/core/repositories/MeetingRepository.ts

import { Expert } from "../entities/Expert.entity";
import { Meeting } from "../entities/Meeting.entity";

export interface IMeetingRepository {
  cancelMeeting(meetingId: number): Promise<void>;
  findByEventId(eventId: string): Promise<Meeting | null>;
  findBusyDays(expertId: number): Promise<Date[]>;
  findClientsForExpert(expertId: number): Promise<Expert[]>;
  findTodaysMeetings(expertId: number): Promise<Meeting[]>;
  findPastMeetings(expertId: number): Promise<Meeting[]>;
  findUpcomingMeetings(expertId: number): Promise<Meeting[]>;
  save(meeting: Meeting): Promise<Meeting>;
}
