import { ICalendlyRepository } from "../repositories/CalendlyRepository";

export class GetBusyDays {
  constructor(private repo: ICalendlyRepository) {}

  async execute(expertId: number): Promise<string[]> {
    const token = await this.repo.getAccessToken(expertId); // ✅ Proper decryption
    const userUri = await this.repo.getUserUri(token);

    // Fetch all meetings in the past and upcoming 30 days
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const meetings = await this.repo.getMeetings(token, userUri, start, end);

    const busyDaysSet = new Set<string>();

    for (const meeting of meetings) {
      const dateOnly = meeting.startTime.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      busyDaysSet.add(dateOnly);
    }

    return Array.from(busyDaysSet);
  }
}
