import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMeetingsTable1747312247147 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `Meetings` ADD `status` varchar(255) NULL');
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `Meetings` DROP COLUMN `status`');
    }

}
