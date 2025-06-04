import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskTable1748995049631 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
    ALTER TABLE task
    ADD COLUMN createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  `);
  

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
  ALTER TABLE task
  DROP COLUMN createdAt,
  DROP COLUMN updatedAt
`);

    }

}
