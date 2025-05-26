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
2. Configure your database in `server/config/db.js` and ensure PostgreSQL is running.
3. Start the backend:
   ```
   npm start
   ```

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

### Database Setup
- Run the SQL in `database/schema.sql` to create the necessary tables.

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