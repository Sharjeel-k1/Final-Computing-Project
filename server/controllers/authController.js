import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';

// Registration handler
export const register = async (req, res) => {
  const { email, password, name, contact_number } = req.body;

  try {
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (unverified)
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, contact_number, role, verified)
       VALUES ($1, $2, $3, $4, 'user', FALSE)
       RETURNING id`,
      [name, email, hashedPassword, contact_number]
    );
    const userId = userResult.rows[0].id;

    // Generate verification token
    const verificationToken = crypto.randomBytes(16).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store the plain token for email verification (do NOT hash it)
    await pool.query(
      `INSERT INTO TWO_FACTOR_AUTHENTICATION (user_id, auth_code_hash, timestamp, status)
       VALUES ($1, $2, $3, 'sent')`,
      [userId, verificationToken, verificationTokenExpiresAt]
    );

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Use the correct frontend route for verification
    const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;
    try {
      await transporter.sendMail({
        from: `"Salman Car Workshop" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`,
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
      });
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return res.status(500).json({ error: 'Failed to send verification email. Please contact support.' });
    }

    res.json({ message: 'User registered successfully. Check your email for verification instructions.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.verified) {
        return res.status(403).json({ error: 'Please verify your email before logging in' });
      }

      // Generate 6-digit 2FA code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const codeHash = await bcrypt.hash(code, 10);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store code hash in TWO_FACTOR_AUTHENTICATION
      await pool.query(
        `INSERT INTO TWO_FACTOR_AUTHENTICATION (user_id, auth_code_hash, timestamp, status)
         VALUES ($1, $2, $3, 'sent')`,
        [user.id, codeHash, expiresAt]
      );

      // Send code via email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: `"Salman Car Workshop" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Your 2FA Code',
        text: `Your 2FA code is: ${code}`,
        html: `<p>Your 2FA code is: <b>${code}</b></p>`
      });

      // Respond that 2FA is required
      res.json({ twoFactorRequired: true, userId: user.id });
    } catch (err) {
      console.error('Error logging in:', err.message);
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  },
];

export const verify2FA = async (req, res) => {
  const { userId, code } = req.body;
  try {
    // Get latest sent 2FA code for this user
    const result = await pool.query(
      `SELECT * FROM TWO_FACTOR_AUTHENTICATION WHERE user_id = $1 AND status = 'sent' ORDER BY timestamp DESC LIMIT 1`,
      [userId]
    );
    const record = result.rows[0];
    if (!record) {
      return res.status(400).json({ error: 'No 2FA code found. Please login again.' });
    }
    if (new Date(record.timestamp) < new Date()) {
      return res.status(400).json({ error: '2FA code expired. Please login again.' });
    }
    const valid = await bcrypt.compare(code, record.auth_code_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid 2FA code.' });
    }
    // Mark code as verified
    await pool.query(
      `UPDATE TWO_FACTOR_AUTHENTICATION SET status = 'verified' WHERE id = $1`,
      [record.id]
    );
    // Get user info
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    // Issue JWT
    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Error verifying 2FA:', err.message);
    res.status(500).json({ error: '2FA verification failed', details: err.message });
  }
};

export const forgotPassword = [
  body('email').isEmail().withMessage('Invalid email address'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Check if the user exists
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ error: 'Email does not exist' });
      }

      // Generate a reset token
      const resetToken = Math.random().toString(36).substring(2, 15);

      // Save the token in the database
      await pool.query(
        'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
        [resetToken, Date.now() + 3600000, email] // Token valid for 1 hour
      );

      // Send the reset email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error in forgotPassword:', error.message);
      res.status(500).json({ error: 'Failed to send password reset email' });
    }
  },
];

// Email verification handler
export const verifyEmail = async (req, res) => {
  const token = req.params.token;
  try {
    console.log('Verifying email with token:', token);
    // Find the user by the verification token
    const result = await pool.query(
      `SELECT u.id, u.verified, t.timestamp AS token_expiration, t.status
       FROM users u
       JOIN TWO_FACTOR_AUTHENTICATION t ON u.id = t.user_id
       WHERE t.auth_code_hash = $1`,
      [token]
    );
    console.log('Verification query result:', result.rows);
    const user = result.rows[0];

    if (!user) {
      console.log('No user found for this token');
      return res.status(400).json({ error: 'Invalid verification token' });
    }
    if (user.token_expiration < new Date()) {
      console.log('Token expired:', user.token_expiration, 'Current:', new Date());
      return res.status(400).json({ error: 'Expired verification token' });
    }
    if (user.verified) {
      console.log('User already verified');
      return res.status(200).json({ message: 'Email already verified' });
    }
    // Update user's verification status and token status
    await pool.query(
      `UPDATE users SET verified = TRUE WHERE id = $1`,
      [user.id]
    );
    await pool.query(
      `UPDATE TWO_FACTOR_AUTHENTICATION SET status = 'verified' WHERE auth_code_hash = $1`,
      [token]
    );
    console.log('User verified successfully');
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin login handler
export const adminLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      // Find admin by username
      const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
      const admin = result.rows[0];
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Issue JWT for admin
      const token = jwt.sign(
        { adminId: admin.id, name: admin.name, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.json({ token });
    } catch (err) {
      console.error('Error logging in as admin:', err.message);
      res.status(500).json({ error: 'Admin login failed', details: err.message });
    }
  },
];
