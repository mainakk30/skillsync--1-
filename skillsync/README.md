# SkillSync — MERN Micro-Services Marketplace

> A full-stack freelance service marketplace built with MongoDB, Express.js, React, and Node.js.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Contributing](#contributing)

## Project Overview

SkillSync connects independent service providers with clients. Users create profiles, list services (Web Design, Writing, Tutoring, etc.), browse by category, and book services through a responsive interface.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6, Axios    |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose ODM               |
| Auth       | JWT, bcryptjs                       |
| Dev Tools  | Nodemon, Concurrently, dotenv       |

## Features

- JWT-based user authentication (client & provider roles)
- Full CRUD for service listings
- Category browsing + full-text search
- Booking request system with status management
- Provider profiles with ratings
- Star reviews after project completion
- Protected API routes via middleware
- Fully responsive React frontend

## Project Structure

```
skillsync/
├── server/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── services.js
│   │   ├── bookings.js
│   │   └── reviews.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── ServiceCard.jsx
│       │   │   └── BookingModal.jsx
│       │   └── layout/
│       │       └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Browse.jsx
│       │   ├── ServiceDetail.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreateService.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── context/AuthContext.jsx
│       ├── utils/api.js
│       ├── App.jsx
│       └── main.jsx
│
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone
```bash
git clone https://github.com/your-username/skillsync.git
cd skillsync
```

### 2. Install dependencies
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment — create `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillsync
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Run development servers
```bash
# From root directory — starts both backend and frontend
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Environment Variables

| Variable       | Description                        | Example                        |
|----------------|------------------------------------|--------------------------------|
| PORT           | Express server port                | 5000                           |
| MONGO_URI      | MongoDB connection string          | mongodb://localhost:27017/skillsync |
| JWT_SECRET     | Secret key for signing tokens      | mysecretkey123                 |
| JWT_EXPIRES_IN | Token expiry duration              | 7d                             |
| NODE_ENV       | Environment mode                   | development                    |

## API Reference

### Auth — `/api/auth`
| Method | Endpoint              | Description       | Auth |
|--------|-----------------------|-------------------|------|
| POST   | `/api/auth/register`  | Register user     | No   |
| POST   | `/api/auth/login`     | Login, get token  | No   |
| GET    | `/api/auth/me`        | Current user info | Yes  |

### Services — `/api/services`
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| GET    | `/api/services`       | List all (filterable)    | No   |
| GET    | `/api/services/:id`   | Get single service       | No   |
| POST   | `/api/services`       | Create listing           | Yes  |
| PUT    | `/api/services/:id`   | Update listing           | Yes  |
| DELETE | `/api/services/:id`   | Delete listing           | Yes  |

**Query params:** `?category=Design&search=logo&minPrice=500&maxPrice=5000&page=1&limit=9`

### Bookings — `/api/bookings`
| Method | Endpoint                     | Description               | Auth |
|--------|------------------------------|---------------------------|------|
| GET    | `/api/bookings`              | My bookings (client)      | Yes  |
| GET    | `/api/bookings/received`     | Received bookings (provider) | Yes |
| POST   | `/api/bookings`              | Create booking request    | Yes  |
| PUT    | `/api/bookings/:id/status`   | Accept/decline/complete   | Yes  |

### Users — `/api/users`
| Method | Endpoint              | Description           | Auth |
|--------|-----------------------|-----------------------|------|
| GET    | `/api/users/:id`      | Public profile        | No   |
| PUT    | `/api/users/profile`  | Update profile        | Yes  |

### Reviews — `/api/reviews`
| Method | Endpoint                    | Description           | Auth |
|--------|-----------------------------|-----------------------|------|
| POST   | `/api/reviews`              | Submit review         | Yes  |
| GET    | `/api/reviews/:serviceId`   | Get service reviews   | No   |

## Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

## License

MIT © 2024 SkillSync
