import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileFieldToExpert1746955740531 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `Experts` ADD `profileImage` varchar(255) NULL');
        await queryRunner.query('ALTER TABLE `Experts` ADD `bio` text NULL');
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `Experts` DROP COLUMN `bio`');
        await queryRunner.query('ALTER TABLE `Experts` DROP COLUMN `profileImage`');
      }

}
