import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTasksTable1723640600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "task",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "title", type: "varchar" },
        { name: "description", type: "varchar", isNullable: true },
        { name: "status", type: "varchar", default: "'pending'" },
        { name: "dueDate", type: "timestamp", isNullable: true },
        { name: "expertId", type: "int" },
        { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
      ],
    }));

    await queryRunner.createForeignKey("task", new TableForeignKey({
      columnNames: ["expertId"],
      referencedTableName: "experts",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("task");
  }
}
