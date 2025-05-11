
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
export class CreatenotesTable1746368041352 implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
              new Table({
                name: "notes",
                columns: [
                  {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                  },
                  {
                    name: "text",
                    type: "text",
                  },
                  {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                  },
                  {
                    name: "folderId",
                    type: "int",
                  },
                ],
              })
            );
        
            await queryRunner.createForeignKey(
              "notes",
              new TableForeignKey({
                columnNames: ["folderId"],
                referencedTableName: "folders",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
              })
            );
          }
        
          public async down(queryRunner: QueryRunner): Promise<void> {
            const table = await queryRunner.getTable("notes");
            if (!table) return;
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.includes("folderId"));
            if (foreignKey) {
              await queryRunner.dropForeignKey("notes", foreignKey);
            }
            await queryRunner.dropTable("notes");
          }
        }
