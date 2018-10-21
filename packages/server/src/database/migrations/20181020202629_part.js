export async function up(knex, Promies) {
    await knex.schema.createTable('part', table => {
        table.increments();
        table.string('sku').notNull();
        table.integer('manufacturerId');
        table.integer('categoryId');
        table.string('description');
        table.timestamps(true, true);
    });

    await knex.schema.createTable('part_category', table => {
        table.increments();
        table.string('name').notNull();
        table.string('parentId');
    });

    await knex.schema.createTable('manufacturer', table => {
        table.increments();
        table.string('name').notNull();
        table.string('website');
        table.string('logo');
    });

    await knex.schema.createTable('supplier', table => {
        table.increments();
        table.string('name').notNull();
        table.string('website').notNull();
    });

    await knex.schema.createTable('part_supplier', table => {
        table.increments();
        table.integer('partId').notNull();
        table.integer('supplierId').notNull();
        table.string('sku').notNull();
        table.string('description');
    });
}

export async function down(knex) {
    await knex.schema.dropTable('part');
    await knex.schema.dropTable('part_category');
    await knex.schema.dropTable('manufacturer');
    await knex.schema.dropTable('supplier');
    await knex.schema.dropTable('part_supplier');
}
