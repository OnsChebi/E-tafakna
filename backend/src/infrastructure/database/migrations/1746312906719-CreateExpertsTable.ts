import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateExpertsTable1746312906719 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "experts",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "name", type: "varchar", isNullable: false },
        { name: "email", type: "varchar", isUnique: true, isNullable: false },
        { name: "password", type: "varchar", isNullable: false },
        { name: "accessToken", type: "text", isNullable: true },
        { name: "profileImage", type: "varchar", length: "255", isNullable: true },
        { name: "bio", type: "text", isNullable: true },
        { name: "role", type: "varchar", default: "'expert'" },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("experts");
  }
}
