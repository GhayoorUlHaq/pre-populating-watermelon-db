import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'students',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'class', type: 'string'},
        {name: 'age', type: 'number'},
      ],
    }),
  ],
});
