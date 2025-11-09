import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}




