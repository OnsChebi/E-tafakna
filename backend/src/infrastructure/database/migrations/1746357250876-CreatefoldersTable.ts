import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";

export class CreatefoldersTable1746357250876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "folders",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "name", type: "varchar", length: "255" },
        { name: "expertId", type: "int" },
      ],
    }));

    await queryRunner.createUniqueConstraint("folders", new TableUnique({
      name: "UQ_FOLDER_EXPERT_NAME",
      columnNames: ["name", "expertId"],
    }));

    await queryRunner.createForeignKey("folders", new TableForeignKey({
      columnNames: ["expertId"],
      referencedTableName: "experts",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("folders");
  }
}
