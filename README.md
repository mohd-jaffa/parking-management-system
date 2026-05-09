# 🚗 Parking Management System

A backend-focused Parking Management System built using Node.js, Express.js, and MongoDB.

This system manages:

- Parking slots
- Vehicles
- Parking tickets
- Vehicle entry & exit
- Slot allocation
- JWT Authentication

The project focuses on backend architecture, validation, and concurrency handling.

---

# ✨ Features

## Authentication

- JWT-based authentication
- Protected APIs using middleware
- Login & profile APIs
- Password hashing using bcrypt

---

# 🚘 Vehicle Management

- Vehicle creation & validation
- Unique vehicle number enforcement
- Vehicle type validation:
  - bike
  - car
  - truck

---

# 🅿️ Parking Slot Management

- Create parking slots
- Get all parking slots
- Slot occupancy tracking

---

# 🎫 Parking Ticket Management

- Auto-generated incremental ticket numbers
- Ticket numbers formatted as:
  - 0001
  - 0002
  - 0003
- Active/inactive ticket handling
- Ticket history APIs
- Active ticket filtering
- Inactive ticket filtering

---

# ⚡ Smart Slot Allocation

The system automatically:

- Finds nearest available slot
- Matches vehicle type with slot type
- Prevents duplicate slot allocation
- Prevents multiple active tickets per vehicle

Implemented using:

- MongoDB transactions
- Atomic operations
  
---

# 🚪 Vehicle Exit Flow

On exit:

- Exit time is recorded
- Parking amount is calculated
- Partial hours are rounded up
- Ticket is marked inactive
- Slot is released automatically

---

# 💰 Pricing Logic

| Vehicle Type | First Hour | Additional Hours |
|---|---|---|
| Bike | ₹10 | ₹5 |
| Car | ₹20 | ₹10 |
| Truck | ₹30 | ₹15 |

---

# ✅ Backend Highlights

- Proper schema validation
- Custom validation messages
- Unique constraint handling
- MongoDB transactions
- Atomic slot allocation
- Error handling
- JWT authentication
- Request logging using Morgan

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Morgan

---

# 📂 Main APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile |
| POST | `/api/parking-slots` | Create parking slot |
| GET | `/api/parking-slots` | Get parking slots |
| POST | `/api/parking-tickets` | Create parking ticket |
| PUT | `/api/parking-tickets/exit/:ticketId` | Exit vehicle |
| GET | `/api/parking-tickets` | Get tickets |

---

# 🔒 Important Backend Concepts Used

- Authentication middleware
- Transaction rollback safety
- Concurrency-safe slot allocation
- Schema-level validation
- Populate references

---

# 🚀 Setup

## Clone Repository

```bash
git clone https://github.com/mohd-jaffa/parking-management-system.git
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Create `.env`

```env
PORT=your_port

DB_URL=your_mongodb_url

JWT_SECRET=your_secret_key
```

---

## Run Backend

```bash
npm run dev
```

---

# 📌 Frontend

Frontend is built using:

- React
- Vite

The frontend is made using minimal ui just to demonstrate the usage of the APIs
