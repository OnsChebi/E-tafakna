import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpertTable1747393150645 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`Experts\` 
      ADD \`role\` varchar(255) NOT NULL DEFAULT 'expert'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`Experts\` 
      DROP COLUMN \`role\`
    `);
  }

}
