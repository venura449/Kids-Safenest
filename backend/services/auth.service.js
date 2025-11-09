import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, updateUserResetToken, findUserByResetToken, updateUserPassword } from '../models/user.model.js';
import { signToken, generateResetToken } from '../utils/token.js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config('../.env');

const emailapi = process.env.RESEND_API_KEY;

const resend = new Resend(emailapi);

export async function register({ name, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('Email already in use');
  const hashed = await bcrypt.hash(password, 10);
  const [user] = await createUser({ name, email, password: hashed });
  const token = signToken({ id: user.id, email: user.email });
  return { user, token };
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = signToken({ id: user.id, email: user.email });
  return { user, token };
}

export async function forgotPassword({ email }) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Email not found');

  const resetToken = generateResetToken();
  const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

  await updateUserResetToken(email, resetToken, resetTokenExpires);

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your Safe Net password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Safe Net</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${user.name},</h2>
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password for your Safe Net account. 
              If you didn't make this request, you can safely ignore this email.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Reset Password
              </a>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Or copy and paste this link into your browser:
            </p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; color: #666;">
              <a href="${resetLink}" style="color: #667eea;">${resetLink}</a>
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e5e9;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </p>
              <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 Safe Net. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error);
    // Still return success to avoid exposing internal errors to the user
    return { success: true, message: 'Password reset email sent successfully' };
  }
}

export async function resetPassword({ resetToken, newPassword }) {
  const user = await findUserByResetToken(resetToken);
  if (!user) throw new Error('Invalid reset token');
  
  if (new Date() > new Date(user.reset_token_expires)) {
    throw new Error('Reset token has expired');
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(user.id, hashedPassword);
  
  return { message: 'Password reset successfully' };
}




