import type { MigrationInterface, QueryRunner } from 'typeorm';
import { down, up } from './sql/001-foundation.js';

export class Foundation1731100000000 implements MigrationInterface {
  name = 'Foundation1731100000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const sql of up) await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const sql of down) await queryRunner.query(sql);
  }
}
