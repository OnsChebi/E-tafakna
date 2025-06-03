import { IDocumentRepository } from "../repositories/DocumentRepository";

export class GetDocumentsByMeetingUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  async execute(meetingId: number) {
    return await this.documentRepo.findByMeeting(meetingId);
  }
}
