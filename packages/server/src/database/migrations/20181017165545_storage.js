export async function up(knex, Promies) {
    await knex.schema.createTable('storage', table => {
        table.increments();
        table.string('name').notNull();
        table.integer('colorId');
        table.integer('locationId');
        table.timestamps(true, true);
    });

    await knex.schema.createTable('storage_location', table => {
        table.increments();
        table.string('name').notNull();
        table.timestamps(true, true);
    });

    await knex.schema.createTable('storage_color', table => {
        table.increments();
        table.string('color').notNull();
    });
}

export async function down(knex) {
    await knex.schema.dropTable('storage');
    await knex.schema.dropTable('storage_location');
    await knex.schema.dropTable('storage_color');
}
