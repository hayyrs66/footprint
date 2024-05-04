import { column, defineDb } from 'astro:db';

const Storage = {
  columns: {
    userId: column.text({ primaryKey: true, unique: true }),
    storage: column.number(),
    calculatedAt: column.date()
  }
}

export default defineDb({
  tables: {
    Storage
  }
});
