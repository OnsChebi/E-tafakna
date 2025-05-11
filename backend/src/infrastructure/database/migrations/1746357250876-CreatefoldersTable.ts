
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";
export class CreatefoldersTable1746357250876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the folders table
        await queryRunner.createTable(
            new Table({
                name: "folders",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "expertId",
                        type: "int",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        // Add the unique index on (name, expertId)
        await queryRunner.createIndex(
            "folders",
            new TableIndex({
                name: "IDX_folder_name_expert",
                columnNames: ["name", "expertId"],
                isUnique: true,
            })
        );

        // Add foreign key constraint
        await queryRunner.createForeignKey(
            "folders",
            new TableForeignKey({
                columnNames: ["expertId"],
                referencedColumnNames: ["id"],
                referencedTableName: "experts",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("folders");
    }
}