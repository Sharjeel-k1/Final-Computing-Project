-- ADMINS table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL
);

-- USERS table (no role column)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL
);

-- ORDERS table (Updated with vehicle_id and number_plate)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    number_plate VARCHAR(50) NOT NULL, -- Number plate stored directly
    customer_name VARCHAR(255),
    car_model VARCHAR(255),
    issue TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INVOICES table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(10, 2),
    payment_status VARCHAR(20) DEFAULT 'Unpaid'
);

CREATE TABLE TWO_FACTOR_AUTHENTICATION (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    auth_code_hash VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL
);

ALTER TABLE users
ADD COLUMN reset_password_token VARCHAR(255),
ADD COLUMN reset_password_expires BIGINT;

ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT FALSE;

ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);

