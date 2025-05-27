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

### Backend Setup
1. Navigate to the server folder:
   ```
   cd server
   npm install
   ```
2. (Optional) Seed test data for the backend (if a script exists):
   ```
   npm run seed
   ```
   *(Ensure you have a `seed` script in your `server/package.json` and a corresponding seed file, e.g., `server/seed.js`.)*
3. Configure your database in `server/config/db.js` and ensure PostgreSQL is running.
4. Start the backend:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the client folder:
   ```
   cd client
   npm install
   ```
2. (Optional) Seed test data for the frontend (if a script exists):
   ```
   npm run seed
   ```
   *(Ensure you have a `seed` script in your `client/package.json` and a corresponding seed file, if applicable.)*
3. Start the frontend:
   ```
   npm run dev
   ```
   (or use `npm start` if using Create React App)

### Database Setup
- Run the SQL in `database/schema.sql` to create the necessary tables.
- To seed test data, run the SQL in `database/seed.sql`:
  ```
  psql -U your_db_user -d your_db_name -f database/seed.sql
  ```
  Replace `your_db_user` and `your_db_name` with your PostgreSQL username and database name.

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