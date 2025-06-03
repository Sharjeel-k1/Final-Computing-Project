import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const password = 'password';
  const hash = await bcrypt.hash(password, 10);

  // Clean up previous test data (optional, for idempotency)
  await pool.query("DELETE FROM orders;");
  await pool.query("DELETE FROM users;");

  // Insert users
  const userRes = await pool.query(
    `INSERT INTO users (name, email, password, contact_number, verified)
     VALUES
     ('Alice Smith', 'alice@example.com', $1, '1234567890', TRUE),
     ('Bob Jones', 'bob@example.com', $1, '0987654321', TRUE)
     RETURNING id, name;`,
    [hash]
  );
  const [alice, bob] = userRes.rows;

  // Insert orders
  await pool.query(
    `INSERT INTO orders (user_id, number_plate, customer_name, car_model, issue, status)
     VALUES
     ($1, 'ABC123', 'Alice Smith', 'Toyota Corolla', 'Engine noise', 'Pending'),
     ($2, 'XYZ789', 'Bob Jones', 'Honda Civic', 'Brake issue', 'In Progress')`,
    [alice.id, bob.id]
  );

  console.log('Test users and orders seeded successfully!');
  await pool.end();
}

seed().catch(e => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
