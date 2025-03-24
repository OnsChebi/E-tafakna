import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1742768190986 implements MigrationInterface {
  name = "UpdateSchema1742768190986";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if tables exist before creating them
    const meetingsTableExists = await queryRunner.hasTable("Meetings");
    const meetingsNotificationTableExists = await queryRunner.hasTable("MeetingsNotification");
    const expertsTableExists = await queryRunner.hasTable("Experts");
    const foldersTableExists = await queryRunner.hasTable("Folders");
    const notesTableExists = await queryRunner.hasTable("Notes");

    // Create tables if they don't exist
    if (!meetingsTableExists) {
      await queryRunner.query(`
        CREATE TABLE \`Meetings\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`date\` datetime NOT NULL,
          \`time\` varchar(255) NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`expertId\` int NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
    }

    if (!meetingsNotificationTableExists) {
      await queryRunner.query(`
        CREATE TABLE \`MeetingsNotification\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`content\` varchar(255) NOT NULL,
          \`title\` varchar(255) NOT NULL,
          \`isRead\` tinyint NOT NULL DEFAULT 0,
          \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`expertId\` int NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
    }

    if (!expertsTableExists) {
      await queryRunner.query(`
        CREATE TABLE \`Experts\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`email\` varchar(255) NOT NULL,
          \`password\` varchar(255) NOT NULL,
          UNIQUE INDEX \`IDX_78e483a3c46bdcca553b366e74\` (\`email\`),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
    }

    if (!foldersTableExists) {
      await queryRunner.query(`
        CREATE TABLE \`Folders\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`expertId\` int NULL,
          UNIQUE INDEX \`UQ_FOLDER_EXPERT_NAME\` (\`name\`, \`expertId\`),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
    }

    if (!notesTableExists) {
      await queryRunner.query(`
        CREATE TABLE \`Notes\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`text\` varchar(255) NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`folderId\` int NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
    }

    // Add foreign key constraints if the tables exist and the constraints don't already exist
    if (meetingsTableExists && expertsTableExists) {
      const fkExists = await queryRunner.query(`
        SELECT COUNT(*) AS count
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE()
          AND TABLE_NAME = 'Meetings'
          AND CONSTRAINT_NAME = 'FK_14ef6e7afc07c5c7a5dc024a3ac'
      `);
      if (fkExists[0].count === 0) {
        await queryRunner.query(`
          ALTER TABLE \`Meetings\`
          ADD CONSTRAINT \`FK_14ef6e7afc07c5c7a5dc024a3ac\`
          FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      }
    }

    if (meetingsNotificationTableExists && expertsTableExists) {
      const fkExists = await queryRunner.query(`
        SELECT COUNT(*) AS count
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE()
          AND TABLE_NAME = 'MeetingsNotification'
          AND CONSTRAINT_NAME = 'FK_88a8b25a7bb02f22b6982543573'
      `);
      if (fkExists[0].count === 0) {
        await queryRunner.query(`
          ALTER TABLE \`MeetingsNotification\`
          ADD CONSTRAINT \`FK_88a8b25a7bb02f22b6982543573\`
          FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      }
    }

    if (foldersTableExists && expertsTableExists) {
      const fkExists = await queryRunner.query(`
        SELECT COUNT(*) AS count
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE()
          AND TABLE_NAME = 'Folders'
          AND CONSTRAINT_NAME = 'FK_47a846ab41ed3aa182a4179368a'
      `);
      if (fkExists[0].count === 0) {
        await queryRunner.query(`
          ALTER TABLE \`Folders\`
          ADD CONSTRAINT \`FK_47a846ab41ed3aa182a4179368a\`
          FOREIGN KEY (\`expertId\`) REFERENCES \`Experts\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      }
    }

    if (notesTableExists && foldersTableExists) {
      const fkExists = await queryRunner.query(`
        SELECT COUNT(*) AS count
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE()
          AND TABLE_NAME = 'Notes'
          AND CONSTRAINT_NAME = 'FK_40bc503ec11bb91994b6ae690d9'
      `);
      if (fkExists[0].count === 0) {
        await queryRunner.query(`
          ALTER TABLE \`Notes\`
          ADD CONSTRAINT \`FK_40bc503ec11bb91994b6ae690d9\`
          FOREIGN KEY (\`folderId\`) REFERENCES \`Folders\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.query(`
      ALTER TABLE \`Notes\` DROP FOREIGN KEY \`FK_40bc503ec11bb91994b6ae690d9\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`Folders\` DROP FOREIGN KEY \`FK_47a846ab41ed3aa182a4179368a\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`MeetingsNotification\` DROP FOREIGN KEY \`FK_88a8b25a7bb02f22b6982543573\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`Meetings\` DROP FOREIGN KEY \`FK_14ef6e7afc07c5c7a5dc024a3ac\`
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE \`Notes\``);
    await queryRunner.query(`DROP INDEX \`UQ_FOLDER_EXPERT_NAME\` ON \`Folders\``);
    await queryRunner.query(`DROP TABLE \`Folders\``);
    await queryRunner.query(`DROP INDEX \`IDX_78e483a3c46bdcca553b366e74\` ON \`Experts\``);
    await queryRunner.query(`DROP TABLE \`Experts\``);
    await queryRunner.query(`DROP TABLE \`MeetingsNotification\``);
    await queryRunner.query(`DROP TABLE \`Meetings\``);
  }
}