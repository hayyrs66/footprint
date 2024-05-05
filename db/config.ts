import { column, defineDb } from 'astro:db';

const Storage = {
  columns: {
    id: column.number({ primaryKey: true }),
    userId: column.text(),
    storage: column.number(),
    storageLimit: column.number(),
    calculatedAt: column.date()
  }
}

export default defineDb({
  tables: {
    Storage
  }
});