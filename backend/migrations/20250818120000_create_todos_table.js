export function up(knex) {
  return knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title').notNullable();
    table.boolean('completed').notNullable().defaultTo(false);
    table.string('priority').notNullable().defaultTo('medium');
    table.date('due_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('todos');
}


