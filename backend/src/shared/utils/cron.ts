import cron from "node-cron";
import { CalendlyRepositoryImpl } from "../../infrastructure/database/repo/CalendlyRepositoryImp";
import { ExpertRepositoryImpl } from "../../infrastructure/database/repo/ExpertRepositoryImpl";
import { MeetingRepositoryImpl } from "../../infrastructure/database/repo/MeetingRepositoryImp";
import { SyncCalendlyMeetingsUseCase } from "../../core/use-cases/calendly/SyncCalendlyMeetings";

export const startMeetingSyncCron = (
  meetingRepo: MeetingRepositoryImpl,
  calendlyRepo: CalendlyRepositoryImpl,
  expertRepo: ExpertRepositoryImpl
) => {
  const syncUseCase = new SyncCalendlyMeetingsUseCase(
    meetingRepo,
    calendlyRepo,
    expertRepo
  );

  cron.schedule("* 3 * * *", async () => {
    //console.log("🔁 [CRON] Syncing Calendly meetings...");

    try {
      const allExperts = await expertRepo.getAll();

      const expertsWithCalendly = allExperts.filter(
        (expert) => expert.accessToken
      );

      for (const expert of expertsWithCalendly) {
        try {
          await syncUseCase.execute(expert.id);
          //console.log(`✅ Synced expert ${expert.id}`);
        } catch (error: any) {
          console.error(`❌ Error syncing expert ${expert.id}:`, error.message);
        }
      }
    } catch (err) {
      console.error("❌ CRON failed:", err);
    }
  });
};
