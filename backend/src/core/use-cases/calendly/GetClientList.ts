// core/use-cases/GetClientList.ts
import { IMeetingRepository } from "../../repositories/MeetingRepository";

export class GetClientListUseCase {
  constructor(private meetingRepo: IMeetingRepository) {}

  async execute(expertId: number) {
    return this.meetingRepo.findClientsForExpert(expertId);
  }
}
