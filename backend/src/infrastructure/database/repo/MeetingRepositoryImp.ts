import { Repository, LessThan, MoreThan, Between } from "typeorm";
import { IMeetingRepository } from "../../../core/repositories/MeetingRepository";
import { Meeting } from "../../../core/entities/Meeting.entity";
import { Expert } from "../../../core/entities/Expert.entity";
import { AppDataSource } from "../db";

export class MeetingRepositoryImpl implements IMeetingRepository {
  private repo: Repository<Meeting>;

  constructor() {
    this.repo = AppDataSource.getRepository(Meeting);
  }

  async save(meeting: Meeting): Promise<Meeting> {
    const existing = await this.repo.findOneBy({ eventId: meeting.eventId });
    return existing ?? this.repo.save(meeting);
  }

  async findByEventId(eventId: string): Promise<Meeting | null> {
    return await this.repo.findOne({
      where: { eventId },
      relations: ['expert'],
    });
  }
  

  async cancelMeeting(eventId: string): Promise<void> {
    const meeting = await this.repo.findOneOrFail({ where: { eventId } });
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

  async findClientsForExpert(expertId: number): Promise<Partial<Expert>[]> {
    const meetings = await this.repo.find({
      where: {
        expert: { id: expertId },
        status: "active",
      },
    });

    const clients = meetings.map(m => ({
      id: m.inviteeEmail,
      name: m.inviteeName,
      email: m.inviteeEmail,
      image: m.inviteeImage,
    }));

    const uniqueClients = Array.from(
      new Map(clients.map(c => [c.email, c])).values()
    );

    return uniqueClients as any; 
  }

  async findTodaysMeetings(expertId: number): Promise<Meeting[]> {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    //console.log("Now:", today.toISOString());
    const end = new Date(today.setHours(23, 59, 59, 999));
    //console.log("Expert ID:", expertId);


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
    //console.log("Expeeeeeeeeeeeeeeeeeert ID iiiiiiiiiiiis:", expertId);
    return this.repo.find({
      where: {
        expert: { id: expertId },
        startTime: MoreThan(now),
        status: "active",
      },
    });
  }

  async saveMeetingsForExpert(expertId: number, meetings: Meeting[]): Promise<void> {
    for (const meeting of meetings) {
      const existing = await this.repo.findOneBy({ eventId: meeting.eventId });
      if (!existing) {
        meeting.expert = { id: expertId } as Expert;
        await this.repo.save(meeting);
      }
    }
  }
}
