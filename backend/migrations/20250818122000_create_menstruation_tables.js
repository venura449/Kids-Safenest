export function up(knex) {
  return knex.schema
    .createTable('menstruation_profiles', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').unique();
      table.integer('cycle_length').notNullable().defaultTo(28);
      table.date('last_period').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('menstruation_symptoms', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('symptom').notNullable();
      table.string('severity').notNullable().defaultTo('mild');
      table.string('notes');
      table.date('date').notNullable();
      table.string('phase');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('menstruation_moods', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('mood').notNullable();
      table.integer('energy').notNullable().defaultTo(5);
      table.string('notes');
      table.date('date').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('menstruation_moods')
    .dropTableIfExists('menstruation_symptoms')
    .dropTableIfExists('menstruation_profiles');
}


