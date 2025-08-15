import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRefreshTokenToExpert1755268531161 implements MigrationInterface {
    name = 'AddRefreshTokenToExpert1755268531161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "experts",
            new TableColumn({
                name: "refreshToken",
                type: "varchar",
                length: "255",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("experts", "refreshToken");
    }
}