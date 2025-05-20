
import { Meeting } from "../entities/Meeting.entity";

export interface ICalendlyRepository {
  getUserUri(token: string): Promise<string>;
  getMeetings(token: string, userUri: string, startTime?: string, endTime?: string): Promise<Meeting[]>;
  getClientList(token: string, userUri: string): Promise<{ name: string, email: string }[]>;
  getAccessToken(expertId: number): Promise<string>;
  cancelMeeting(token: string, eventUri: string , reason:string): Promise<void>;


}
