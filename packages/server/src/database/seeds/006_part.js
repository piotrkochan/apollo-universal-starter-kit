import { returnId, truncateTables } from '../../sql/helpers';
import faker from 'faker';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['part', 'part_category', 'manufacturer', 'supplier', 'part_supplier']);

  for (let i = 0; i < 50; i++) {
    await returnId(knex('part_category')).insert({
      name: faker.hacker.adjective()
    });
  }
  for (let i = 0; i < 30; i++) {
    await returnId(knex('manufacturer')).insert({
      name: faker.company.companyName(),
    });
  }

  const suppliers = [{ name: 'tme', www: 'https://tme.eu' }, { name: 'digikey', www: 'https://digikey.com' }, { name: 'mouser', www: 'https://mouser.com' }];

  for (const supplier of suppliers) {
    await returnId(knex('supplier')).insert({
      name: supplier.name,
      website: supplier.www
    });
  }

  for (let i = 0; i < 100; i++) {
    await returnId(knex('part')).insert({
      sku: faker.helpers.slugify(faker.commerce.productName()).toUpperCase(),
      manufacturerId: faker.random.number(1, 30),
      categoryId: faker.random.number(1, 50),
      description: faker.lorem.sentence()
    });
  }

  for (let i = 0; i < 40; i++) {
    await returnId(knex('part_supplier')).insert({
      partId: faker.random.number(1, 100),
      supplierId: faker.random.number(1, suppliers.length),
      sku: faker.helpers.slugify(faker.commerce.productName()).toUpperCase(),
      description: faker.lorem.sentence()
    });
  }
}