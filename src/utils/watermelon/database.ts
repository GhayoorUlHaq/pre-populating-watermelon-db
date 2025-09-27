import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './schema';
import migrations from './migrations';
import {Student} from './models';
import {migrateStudents} from './migrateStudents';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: false,
});

export const database = new Database({
  adapter,
  modelClasses: [Student],
});

// Initialize migration on database creation
(async () => {
  await migrateStudents();
})();
