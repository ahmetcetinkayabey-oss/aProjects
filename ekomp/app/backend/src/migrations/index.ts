import { Foundation1731100000000 } from './1731100000000-Foundation.js';
import { SchedulingCore1731100000001 } from './1731100000001-SchedulingCore.js';
import * as foundation from './sql/001-foundation.js';
import * as scheduling from './sql/002-scheduling-core.js';

/** Sıra önemlidir; yeni migration sona eklenir, eskiler değiştirilmez. */
export const MIGRATIONS = [Foundation1731100000000, SchedulingCore1731100000001];

/** Testler için: aynı SQL, sırayla. */
export const MIGRATION_SQL = [foundation, scheduling];
