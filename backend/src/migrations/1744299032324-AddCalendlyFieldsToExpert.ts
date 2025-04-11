import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalendlyFieldsToExpert1744299032324 implements MigrationInterface {
    name = 'AddCalendlyFieldsToExpert1744299032324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_access_token\` varchar(255) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_refresh_token\` varchar(255) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_user_uri\` varchar(255) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_access_token\``
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_refresh_token\``
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_user_uri\``
        );
    }
}