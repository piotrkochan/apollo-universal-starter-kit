export async function up(knex, Promies) {
    await knex.schema.createTable('user_part', table => {
        table.increments();
        table.integer('userId');
        table.string('amount').notNull();
        table.integer('userCategoryId').notNull();
        table.integer('basePartId');
        table.string('customPartId');
        table.timestamps(true, true);
    });

    await knex.schema.createTable('custom_part', table => {
        table.increments();
        table.string('description');
        table.integer('manufacturerId');
    });

    await knex.schema.createTable('user_part_category', table => {
        table.increments();
        table.integer('userId');
        table.string('name').notNull();
        table.string('parentId');
    });
}

export async function down(knex) {
    await knex.schema.dropTable('user_part');
    await knex.schema.dropTable('custom_part');
    await knex.schema.dropTable('user_part_category');
}
