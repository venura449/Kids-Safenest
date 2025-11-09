export function up(knex) {
  return knex.schema.createTable('device', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('college').notNullable();
    table.string('gender').notNullable();
    table.integer('weight').notNullable();
    table.integer('height').notNullable();
    table.date('dob').notNullable().defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('device');
}

