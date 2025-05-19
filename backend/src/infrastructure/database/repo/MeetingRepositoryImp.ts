import { Repository } from "typeorm";
import { IMeetingRepository } from "../../../core/repositories/MeetingRepository";
import { Meeting } from "../../../core/entities/Meeting.entity";
import { Expert } from "../../../core/entities/Expert.entity";
import { LessThan, MoreThan, Between } from "typeorm";
import { AppDataSource } from "../db";

export class MeetingRepositoryImpl implements IMeetingRepository {
  private repo: Repository<Meeting>;

  constructor() {
    this.repo = AppDataSource.getRepository(Meeting);
  }
  async findByEventId(eventId: string): Promise<Meeting | null> {
    return this.repo.findOne({ where: { eventId } });
  }
  

  async cancelMeeting(meetingId: number): Promise<void> {
    const meeting = await this.repo.findOneOrFail({ where: { id: Number(meetingId) } });
    meeting.status = "canceled";
    await this.repo.save(meeting);
  }

  async findBusyDays(expertId: number): Promise<Date[]> {
    const meetings = await this.repo.find({
      where: {
        expert: { id: expertId },
        status: "active",
      },
    });

    const busyDays = Array.from(
      new Set(meetings.map(m => m.startTime.toISOString().split('T')[0]))
    ).map(d => new Date(d));

    return busyDays;
  }

  async findClientsForExpert(expertId: number): Promise<Expert[]> {
    const meetings = await this.repo.find({
      where: {
        expert: { id: expertId },
        status: "active",
      },
    });

    // Simulate "clients" using inviteeEmail/name (since there's no Client entity)
    const clients = meetings.map(m => ({
      id: m.inviteeEmail, // use email as a pseudo ID
      name: m.inviteeName,
      email: m.inviteeEmail,
      image: m.inviteeImage,
    }));

    const uniqueClients = Array.from(
      new Map(clients.map(c => [c.email, c])).values()
    );

    return uniqueClients as any; // cast if you need Expert[], or define a DTO/interface
  }

  async findTodaysMeetings(expertId: number): Promise<Meeting[]> {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    return this.repo.find({
      where: {
        expert: { id: expertId },
        startTime: Between(start, end),
        status: "active",
      },
    });
  }

  async findPastMeetings(expertId: number): Promise<Meeting[]> {
    const now = new Date();

    return this.repo.find({
      where: {
        expert: { id: expertId },
        startTime: LessThan(now),
        status: "active",
      },
    });
  }

  async findUpcomingMeetings(expertId: number): Promise<Meeting[]> {
    const now = new Date();

    return this.repo.find({
      where: {
        expert: { id: expertId },
        startTime: MoreThan(now),
        status: "active",
      },
    });
  }

  async save(meeting: Meeting): Promise<Meeting> {
    return this.repo.save(meeting);
  }
}
