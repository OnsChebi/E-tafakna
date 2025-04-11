import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCalendlyFieldsToExpert1744358390899 implements MigrationInterface {
    name = 'UpdateCalendlyFieldsToExpert1744358390899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Experts\` 
            ADD \`calendly_link\` varchar(255) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Experts\` DROP COLUMN \`calendly_link\``
        );
    }

}
