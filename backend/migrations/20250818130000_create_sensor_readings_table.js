export function up(knex) {
  return knex.schema.createTable('sensor_readings', (table) => {
    table.increments('id').primary();
    table.string('watch_id').notNullable();
    table.decimal('temp', 5, 2);
    table.decimal('humidity', 5, 2);
    table.decimal('pressure', 7, 2);
    table.decimal('latitude', 10, 6);
    table.decimal('longitude', 10, 6);
    table.decimal('battery', 5, 2);
    table.integer('spo2');
    table.integer('bpm');
    table.timestamp('received_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('sensor_readings');
}



