# 🏟️ NammaArena

NammaArena is a full-stack **Turf Management System** built with a microservices architecture. This repository contains the **React frontend** that powers the entire user interface for all three roles — Admin, Owner, and User.

> 🔗 Backend microservices are maintained in separate repositories.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Payments | Stripe (via @stripe/react-stripe-js) |
| Containerization | Docker + Nginx |

---

## 👥 Roles & Features

### 🔴 Admin - Only One
- View all registered users and owners + **delete** any user or owner account
- View all turfs across the platform + **approve or reject** turf listings submitted by owners (a turf is only visible to users after admin approval)
- View all bookings across the system + **cancel** any user's booking

### 🟡 Owner
- Register and manage their own turf listings
- Submit turfs for admin approval
- View their own turfs and their current approval status
- View all bookings made on their turfs by users and bookings can be cancelled

### 🟢 User
- Browse all approved turfs
- Book a turf by selecting sport, date, and time slot
- **Stripe-integrated payment** — booking is confirmed only after successful payment
- View all confirmed bookings
- Cancel existing bookings

---

## 🏗️ Architecture Overview

NammaArena follows a **microservices architecture** with the following backend services:

| Service | Responsibility |
|---|---|
| `eureka-server` | Service discovery — all microservices register here |
| `api-gateway` | Single entry point, JWT validation, request routing |
| `auth-service` | User registration, login, JWT generation, role management |
| `turf-service` | Turf CRUD, sport management, approval workflow |
| `booking-service` | Booking creation, status management, cancellation |
| `payment-service` | Stripe payment intent creation & confirmation, booking status update |

All inter-service communication is routed through the **API Gateway** on port `8080`. The frontend proxies all API calls to it via Vite's dev proxy config.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/          # Logo and background images
│   ├── components/      # Navbar, GlobalBackground, ProtectedRoute, Alerts
│   ├── context/         # AuthContext — global auth state
│   ├── pages/
│   │   ├── admin/       # AdminUsers, AdminTurfs, AdminBookings
│   │   ├── owner/       # OwnerTurfs, OwnerBookings
│   │   └── user/        # UserTurfs, BookTurf, Payment, UserBookings
│   ├── services/        # Axios API service layer
│   ├── App.jsx          # Routes definition
│   └── main.jsx         # Entry point
├── Dockerfile           # Multi-stage Docker build
├── .dockerignore
├── .gitignore
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- Backend microservices running (or Docker Compose)

### Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`. All API calls are proxied to `http://localhost:8080` (API Gateway).

---

## 🐳 Docker

```bash
# Build the image
docker build -t nammaarena-frontend .

# Run the container
docker run -p 80:80 nammaarena-frontend
```

The Dockerfile uses a **multi-stage build**:
1. **Stage 1** — Node 20 builds the production bundle (`npm run build`)
2. **Stage 2** — Nginx serves the static `dist/` output

---

## 🔗 Backend Repositories

| Service | Repository |
|---|---|
| Eureka Server | _coming soon_ |
| API Gateway | _coming soon_ |
| Auth Service | _coming soon_ |
| Turf Service | _coming soon_ |
| Booking Service | _coming soon_ |
| Payment Service | _coming soon_ |

---

## 💳 Stripe Integration

Payments are handled via **Stripe**. The payment flow:
1. User selects a turf and time slot → booking is created with `PENDING` status
2. Frontend calls payment service to create a **Stripe Payment Intent**
3. User enters card details via Stripe's secure UI
4. On success, payment service confirms the payment and updates booking status to `CONFIRMED`

> Use Stripe test card `4242 4242 4242 4242` for local testing.
