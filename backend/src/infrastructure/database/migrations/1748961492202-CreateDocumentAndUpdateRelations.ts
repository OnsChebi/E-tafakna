import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDocumentsTable1723640300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "documents",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "title", type: "varchar", length: "255" },
        { name: "url", type: "varchar", length: "500" },
        { name: "type", type: "varchar", length: "20" },
        { name: "uploadedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "meetingId", type: "int", isNullable: true },
        { name: "folderId", type: "int", isNullable: true },
      ],
    }));

    await queryRunner.createForeignKeys("documents", [
      new TableForeignKey({
        columnNames: ["meetingId"],
        referencedTableName: "meetings",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
      new TableForeignKey({
        columnNames: ["folderId"],
        referencedTableName: "folders",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("documents");
  }
}
