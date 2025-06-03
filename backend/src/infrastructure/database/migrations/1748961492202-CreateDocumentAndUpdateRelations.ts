import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDocumentAndUpdateRelations1748961492202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //Create documents table
    await queryRunner.createTable(
      new Table({
        name: "documents",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
          },
          {
            name: "url",
            type: "varchar",
            length: "500",
          },
          {
            name: "type",
            type: "enum",
            enum: ["pdf", "docx", "image", "other"],
          },
          {
            name: "uploadedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "meetingId",
            type: "int",
            isNullable: true,
          },
          {
            name: "folderId",
            type: "int",
            isNullable: true,
          },
        ],
      }),
      true
    );

    // add foreign key to meetings
    await queryRunner.createForeignKey(
      "documents",
      new TableForeignKey({
        columnNames: ["meetingId"],
        referencedColumnNames: ["id"],
        referencedTableName: "meetings",
        onDelete: "CASCADE",
      })
    );

    //add foreign key to folders
    await queryRunner.createForeignKey(
      "documents",
      new TableForeignKey({
        columnNames: ["folderId"],
        referencedColumnNames: ["id"],
        referencedTableName: "folders",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("documents");
  }
}
