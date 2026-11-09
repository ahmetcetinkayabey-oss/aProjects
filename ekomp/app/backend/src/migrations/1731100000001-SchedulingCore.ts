import type { MigrationInterface, QueryRunner } from 'typeorm';
import { down, up } from './sql/002-scheduling-core.js';

export class SchedulingCore1731100000001 implements MigrationInterface {
  name = 'SchedulingCore1731100000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const sql of up) await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const sql of down) await queryRunner.query(sql);
  }
}
