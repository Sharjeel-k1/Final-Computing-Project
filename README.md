# Final Computing Project

## Overview
This project is a full-stack car workshop management system. It includes a React frontend and a Node.js/Express backend with PostgreSQL for data storage.

## Features
- User authentication (register, login, JWT)
- Create, view, and manage car repair orders
- Admin dashboard for managing orders
- Vehicle and service management
- Appointment and invoice management

## Project Structure
```
Final-Computing-Project-main/
  client/        # React frontend
  server/        # Node.js/Express backend
  database/      # SQL schema
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL

### Database Setup
1. Create a PostgreSQL database and user (replace values as needed):
   ```sql
   CREATE DATABASE workshop;
   CREATE USER postgres WITH PASSWORD 'db123';
   GRANT ALL PRIVILEGES ON DATABASE workshop TO postgres;
   ```
2. Run the SQL in `database/schema.sql` to create the necessary tables:
   ```sh
   psql -U postgres -d workshop -f database/schema.sql
   ```

### Backend Setup
1. Navigate to the server folder:
   ```
   cd server
   npm install
   ```
2. Configure your environment variables:
   - Create a `.env` file in the `server/` directory with the following content (update values as needed):
     ```env
     PORT=5000
     DATABASE_URL=postgresql://postgres:db123@localhost:5432/workshop
     JWT_SECRET=supersecretkey
     EMAIL_USER=salmanworkshop16@gmail.com
     EMAIL_PASS=wrrl gyoy ujdl omqm
     ```
   - Make sure `DATABASE_URL` matches your PostgreSQL setup.
3. Ensure PostgreSQL is running and the database is accessible.
4. Start the backend:
   ```
   npm start
   ```

### Seeding Test Data
To add example users and orders for testing, run the seed script:

```
powershell
cd server
node .\seedTestData.js
```

- This will insert two users (Alice Smith and Bob Jones, both with password `password`) and two example orders.
- Passwords are securely hashed using bcrypt in the script.
- You can safely run this script multiple times; it will clear previous test users/orders.

### Seeding Admin User
To add a default admin user for testing, run the following script:

```
powershell
cd server
node .\createAdmin.js
```

- This will create an admin user with:
  - Username: Admin1
  - Password: Admin12
  - Name: Admin User
  - Contact Number: 1234567890
- You can safely run this script multiple times; it will not duplicate the admin if it already exists.

### Frontend Setup
1. Navigate to the client folder:
   ```
   cd client
   npm install
   ```
2. Start the frontend:
   ```
   npm run dev
   ```
   (or use `npm start` if using Create React App)

## Usage
- Visit `http://localhost:3000` for the frontend.
- The backend runs on `http://localhost:5000`.
- Register a new user, log in, and create/view orders.
- Admin users can access the admin dashboard.

## Notes
- Update CORS and environment variables as needed for your deployment.
- For production, build the frontend and serve it from the backend.

---

*Created May 2025*
