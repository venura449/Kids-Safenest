import db from '../config/db.js';

export async function findUserByEmail(email) {
  return db('users').where({ email }).first();
}

export async function createUser({ name, email, password }) {
  return db('users').insert({ name, email, password }).returning(['id', 'name', 'email']);
}

export async function updateUserResetToken(email, resetToken, resetTokenExpires) {
  return db('users').where({ email }).update({
    reset_token: resetToken,
    reset_token_expires: resetTokenExpires
  });
}

export async function findUserByResetToken(resetToken) {
  return db('users').where({ reset_token: resetToken }).first();
}

export async function updateUserPassword(userId, newPassword) {
  return db('users').where({ id: userId }).update({
    password: newPassword,
    reset_token: null,
    reset_token_expires: null
  });
}

export function findUserByWatchId(watchId) {
  return db('users').where({ watch_id: watchId }).first();
}

export function linkWatchToUser(userId, watchId) {
  return db('users').where({ id: userId }).update({ watch_id: watchId });
}




