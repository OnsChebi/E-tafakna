import { ICalendlyRepository } from '../repositories/CalendlyRepository';

export class GetTodaysMeetingsUseCase {
  constructor(private readonly calendlyRepo: ICalendlyRepository) {}

  async execute(expertId: number) {
    const accessToken = await this.calendlyRepo.getAccessToken(expertId);
    const userUri = await this.calendlyRepo.getUserUri(accessToken);

    return this.calendlyRepo.getTodaysMeetings(accessToken, userUri);
  }
}
