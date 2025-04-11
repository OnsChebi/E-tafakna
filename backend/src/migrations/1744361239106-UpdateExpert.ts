import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpert1744361239106 implements MigrationInterface {
    name = 'UpdateExpert1744361239106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_access_token\` varchar(1000) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_refresh_token\` varchar(1000) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_user_uri\` varchar(1000) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_link\` varchar(1000) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_link\``
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_user_uri\``
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_refresh_token\``
        );
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_access_token\``
        );
    }
}
