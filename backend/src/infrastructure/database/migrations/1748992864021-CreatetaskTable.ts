import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatetaskTable1748992864021 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tasks",
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
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        isNullable: false,
                        default: "'pending'",
                    },
                    {
                        name: "dueDate",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "expertId",
                        type: "int",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "tasks",
            new TableForeignKey({
                columnNames: ["expertId"],
                referencedTableName: "experts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("tasks");
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("expertId") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("tasks", foreignKey);
        }
        await queryRunner.dropTable("tasks");
    }
}
