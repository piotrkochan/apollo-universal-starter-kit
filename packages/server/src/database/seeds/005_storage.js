import { returnId, truncateTables } from '../../sql/helpers';
import { range } from 'rxjs/observable/range';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['storage', 'storage_color', 'storage_location']);

  for (let i = 0; i < 5; i++) {
    await returnId(knex('storage_color')).insert({
      color: `Color ${i + 1}`,
    });
  }
  for (let i = 0; i < 3; i++) {
    await returnId(knex('storage_location')).insert({
      name: `Location ${i + 1}`,
    });
  }
  for (let i = 0; i < 30; i++) {
    let storage = {name: `Storage: #${i}`};
    if (i < 5) {
      storage.colorId = i;
    }
    if (i < 3) {
      storage.locationId = i;
    }
    await returnId(knex('storage')).insert(storage);
  }
}