import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMeetingsTable1747309209146 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `Meetings` ADD `reason` text NULL');
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `Meetings` DROP COLUMN `reason`');
      }

}
