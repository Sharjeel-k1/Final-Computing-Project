// This script will create an admin user with username 'Admin1' and password 'Admin12' in the database.
// Usage: node createAdmin.js

import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'workshop',
  password: process.env.DB_PASSWORD || 'db123',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

async function createAdmin() {
  const username = 'Admin1';
  const name = 'Admin User';
  const password = 'Admin12';
  const contact_number = '1234567890';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO admins (username, name, password, contact_number) VALUES ($1, $2, $3, $4)',
      [username, name, hashedPassword, contact_number]
    );
    console.log('Admin user created successfully!');
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
