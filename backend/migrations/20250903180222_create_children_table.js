export function up(knex) {
  return knex.schema.createTable('children', (table) => {
    table.increments('id').primary();
    table
      .integer('parent_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('watch_id').unique().notNullable();
    table.string('name').notNullable();
    table.string('college');
    table.string('gender');
    table.integer('weight');
    table.integer('height');
    table.date('dob');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Ensure one parent can't have duplicate watch IDs
    table.unique(['parent_id', 'watch_id']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('children');
}