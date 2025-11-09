import { register, login, forgotPassword, resetPassword } from '../services/auth.service.js';

export async function registerController(req, res) {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await register({ name, email, password });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await login({ email, password });
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    const result = await forgotPassword({ email });
    res.json({ message: 'Password reset email sent successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { resetToken, newPassword } = req.body;
    const result = await resetPassword({ resetToken, newPassword });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}




