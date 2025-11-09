export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('email').unique();
    table.string('password');
    table.string('reset_token');
    table.timestamp('reset_token_expires');
  });
}

export function down(knex) {
  return knex.schema.dropTable('users');
}
