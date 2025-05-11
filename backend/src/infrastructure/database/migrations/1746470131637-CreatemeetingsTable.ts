
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
export class CreatemeetingsTable1746470131637 implements MigrationInterface {

      public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "Meetings",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "eventId",
                type: "varchar",
                isUnique: true,
              },
              {
                name: "startTime",
                type: "timestamp",
              },
              {
                name: "endTime",
                type: "timestamp",
              },
              {
                name: "inviteeName",
                type: "varchar",
              },
              {
                name: "inviteeEmail",
                type: "varchar",
              },
              {
                name: "inviteeImage",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "type",
                type: "varchar",
              },
              {
                name: "meetingUrl",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "expertId",
                type: "int",
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
            ],
          })
        );
    
        await queryRunner.createForeignKey(
          "Meetings",
          new TableForeignKey({
            columnNames: ["expertId"],
            referencedColumnNames: ["id"],
            referencedTableName: "Experts",
            onDelete: "CASCADE",
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Meetings");
      }
    }
    