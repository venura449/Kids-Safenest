import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: '123',
      database: 'safenet'
    }
});

export default db;
