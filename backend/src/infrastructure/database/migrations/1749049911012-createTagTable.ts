// 6 - CreateTagsTable.ts
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTagsTable1723640500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "tags",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "name", type: "varchar", length: "100" },
        { name: "color", type: "varchar", length: "20" },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tags");
  }
}
