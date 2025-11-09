export function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('watch_id').unique();
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('watch_id');
  });
}



