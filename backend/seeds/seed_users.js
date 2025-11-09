import bcrypt from 'bcrypt';

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  const hashed = await bcrypt.hash('password123', 10);
  // Inserts seed entries
  await knex('users').insert([
    { id: 1, name: 'Alice', email: 'alice@example.com', password: hashed },
    { id: 2, name: 'Bob', email: 'bob@example.com', password: hashed }
  ]);
}
