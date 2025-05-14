import { ICalendlyRepository } from '../repositories/CalendlyRepository';

export class GetClientListUseCase {
  constructor(private readonly calendlyRepo: ICalendlyRepository) {}

  async execute(expertId: number) {
    try {
      const accessToken = await this.calendlyRepo.getAccessToken(expertId);
      //console.log('Access token:', accessToken);
  
      const userUri = await this.calendlyRepo.getUserUri(accessToken);
      //console.log('User URI:', userUri);
  
      const clients = await this.calendlyRepo.getClientList(accessToken, userUri);
      //console.log('Clients:', clients);
  
      return clients;
    } catch (error) {
      //console.error('Error in GetClientListUseCase:', error);
      throw error; 
    }
  }
  
}
