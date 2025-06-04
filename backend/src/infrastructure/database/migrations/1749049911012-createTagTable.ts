import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTagTable1749049911012 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
  CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL
  )
`);
await queryRunner.query(`
  CREATE TABLE folders_tags_tags (
    folderId INT NOT NULL,
    tagId INT NOT NULL,
    PRIMARY KEY (folderId, tagId),
    FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
  )
`);
  
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE folders_tags_tags`);
        await queryRunner.query(`DROP TABLE tags`);

        
    }

}
