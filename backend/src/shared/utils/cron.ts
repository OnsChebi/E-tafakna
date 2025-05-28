// src/cron/syncMeetings.ts

import cron from "node-cron";
import { AppDataSource } from "../../infrastructure/database/db";
import { CalendlyRepositoryImpl } from "../../infrastructure/database/repo/CalendlyRepositoryImp";
import { ExpertRepositoryImpl } from "../../infrastructure/database/repo/ExpertRepositoryImpl";
import { MeetingRepositoryImpl } from "../../infrastructure/database/repo/MeetingRepositoryImp";
import { SyncCalendlyMeetingsUseCase } from "../../core/use-cases/SyncCalendlyMeetings";

export const startMeetingSyncCron = async () => {
  await AppDataSource.initialize();

  const calendlyRepo = new CalendlyRepositoryImpl();
  const meetingRepo = new MeetingRepositoryImpl();
  const expertRepo = new ExpertRepositoryImpl();

  const syncUseCase = new SyncCalendlyMeetingsUseCase(
    meetingRepo,
    calendlyRepo,
    expertRepo
  );

  cron.schedule("30 * * * *", async () => {
    console.log("🔁 [CRON] Syncing Calendly meetings...");

    const allExperts = await expertRepo.getAll();

    const expertsWithCalendly = allExperts.filter(
      (expert) => expert.accessToken 
    );

    for (const expert of expertsWithCalendly) {
      try {
        await syncUseCase.execute(expert.id);
        console.log(`✅ Synced expert ${expert.id}`);
      } catch (error: any) {
        console.error(`❌ Error syncing expert ${expert.id}:`, error.message);
      }
    }
  });
};
