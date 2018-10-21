import { returnId, truncateTables } from '../../sql/helpers';
import faker from 'faker';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['user_part', 'custom_part', 'user_part_category']);

  for (let i = 0; i < 50; i++) {
    await returnId(knex('user_part_category')).insert({
      userId: faker.random.arrayElement([1, 2]),
      name: faker.hacker.adjective()
    });
  }

  for (let i = 0; i < 50; i++) {
    await returnId(knex('custom_part')).insert({
      manufacturerId: faker.random.number(1, 30),
      description: faker.lorem.sentence()
    });
  }

  for (let i = 0; i < 100; i++) {
    let part = {
      amount: faker.random.number(1, 50),
      userCategoryId: faker.random.number(1, 50),
      userId: faker.random.arrayElement([1, 2]),
    };

    if(i <= 50) {
      part.customPartId = i;
    } else {
      part.basePartId = i;
    }

    await returnId(knex('user_part')).insert(part);
  }
}