import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitAdmin1721488504685 implements MigrationInterface {
  name = 'InitAdmin1721488504685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "user" (email, username, password, created_by, updated_by)
            VALUES
            ('nghiabuihuu2004@gmail.com', 'Bùi Hữu Nghĩa', '123456', 'system', 'system')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        (
            DELETE FROM "user" WHERE rolename IN ('supperadmin','admin','user');
        )
        `);
  }
}
