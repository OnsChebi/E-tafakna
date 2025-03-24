import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedSchema1742768190986 implements MigrationInterface {
  name = "FixedSchema1742768190986";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`Experts\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        UNIQUE INDEX \`IDX_78e483a3c46bdcca553b366e74\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`Meetings\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`date\` datetime NOT NULL,
        \`time\` varchar(255) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`expertId\` int NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_Meetings_Experts\` FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`MeetingsNotification\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`content\` varchar(255) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`isRead\` tinyint NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`expertId\` int NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_MeetingsNotification_Experts\` FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`Folders\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`expertId\` int NULL,
        UNIQUE INDEX \`UQ_FOLDER_EXPERT_NAME\` (\`name\`, \`expertId\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_Folders_Experts\` FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`Notes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`text\` varchar(255) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`folderId\` int NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_Notes_Folders\` FOREIGN KEY (\`folderId\`) REFERENCES \`Folders\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Notes\` DROP FOREIGN KEY \`FK_Notes_Folders\`;`);
    await queryRunner.query(`ALTER TABLE \`Folders\` DROP FOREIGN KEY \`FK_Folders_Experts\`;`);
    await queryRunner.query(`ALTER TABLE \`MeetingsNotification\` DROP FOREIGN KEY \`FK_MeetingsNotification_Experts\`;`);
    await queryRunner.query(`ALTER TABLE \`Meetings\` DROP FOREIGN KEY \`FK_Meetings_Experts\`;`);

    await queryRunner.query(`DROP TABLE IF EXISTS \`Notes\`;`);
    await queryRunner.query(`DROP INDEX \`UQ_FOLDER_EXPERT_NAME\` ON \`Folders\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`Folders\`;`);
    await queryRunner.query(`DROP INDEX \`IDX_78e483a3c46bdcca553b366e74\` ON \`Experts\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`Experts\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`MeetingsNotification\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`Meetings\`;`);
  }
}
