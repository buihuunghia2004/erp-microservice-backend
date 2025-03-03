import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitRoles1720105653064 implements MigrationInterface {
  name = 'InitRoles1720105653064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "role" (name, created_by, updated_by)
            VALUES
            ('asr_001', 'system', 'system'),
            ('asr_002', 'system', 'system')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        (
            DELETE FROM "role" WHERE rolename IN ('supperadmin','admin','user');
        )
        `);
  }
}
