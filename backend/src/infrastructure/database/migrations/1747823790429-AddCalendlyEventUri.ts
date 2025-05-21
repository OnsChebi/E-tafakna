import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalendlyEventUri1747823790429 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`Experts\`
            ADD COLUMN \`calendlyEventUri\` varchar(255) NULL,
            ADD COLUMN \`calendlyWebhookId\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`Experts\`
            DROP COLUMN \`calendlyEventUri\`,
            DROP COLUMN \`calendlyWebhookId\`
        `);
    }
}