import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1741339151098 implements MigrationInterface {
    name = 'CreateInitialTables1741339151098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`MeetingsNotification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expertId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Notes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Folders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`expertId\` int NULL, UNIQUE INDEX \`IDX_4ef21d18ce2f145eaed506365f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Experts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_78e483a3c46bdcca553b366e74\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Meetings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` datetime NOT NULL, \`time\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expertId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`MeetingsNotification\` ADD CONSTRAINT \`FK_88a8b25a7bb02f22b6982543573\` FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Folders\` ADD CONSTRAINT \`FK_47a846ab41ed3aa182a4179368a\` FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Meetings\` ADD CONSTRAINT \`FK_14ef6e7afc07c5c7a5dc024a3ac\` FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Meetings\` DROP FOREIGN KEY \`FK_14ef6e7afc07c5c7a5dc024a3ac\``);
        await queryRunner.query(`ALTER TABLE \`Folders\` DROP FOREIGN KEY \`FK_47a846ab41ed3aa182a4179368a\``);
        await queryRunner.query(`ALTER TABLE \`MeetingsNotification\` DROP FOREIGN KEY \`FK_88a8b25a7bb02f22b6982543573\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`Meetings\``);
        await queryRunner.query(`DROP INDEX \`IDX_78e483a3c46bdcca553b366e74\` ON \`Experts\``);
        await queryRunner.query(`DROP TABLE \`Experts\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ef21d18ce2f145eaed506365f\` ON \`Folders\``);
        await queryRunner.query(`DROP TABLE \`Folders\``);
        await queryRunner.query(`DROP TABLE \`Notes\``);
        await queryRunner.query(`DROP TABLE \`MeetingsNotification\``);
    }

}
