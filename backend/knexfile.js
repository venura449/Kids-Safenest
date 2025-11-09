export default {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: '123',
      database: 'safenet'
    },
    migrations: {
      directory: './migrations'
    }
  }
};
