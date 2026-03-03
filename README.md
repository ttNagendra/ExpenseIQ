# 💰 ExpenseIQ — Smart Expense Tracker

A full-stack personal finance tracker built with the **MERN stack** (MongoDB, Express, React, Node.js). Track income and expenses, visualize spending patterns with interactive charts, and manage your finances with a sleek, modern UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Authentication** | JWT-based register/login with protected routes |
| **Dashboard** | At-a-glance summary cards (income, expense, balance) with monthly bar charts |
| **Transactions** | Full CRUD with search, category/type filters, date range, and pagination |
| **Analytics** | Monthly trend charts, category breakdowns, and spending insights via Recharts |
| **Settings** | User profile and preferences management |
| **Dark / Light Mode** | System-aware theme toggle with smooth transitions |
| **Collapsible Sidebar** | Desktop sidebar with open/close toggle; responsive mobile drawer |
| **Glassmorphism UI** | Premium glass-card design, gradients, micro-animations, and noise textures |
| **Responsive** | Mobile-first layout — works across phones, tablets, and desktops |

---

## 🛠️ Tech Stack

### Frontend

- **React 19** with Vite 7
- **React Router v7** — client-side routing
- **Recharts** — interactive data visualizations
- **Framer Motion** — page & component animations
- **Tailwind CSS v4** + custom CSS design system
- **React Icons (Heroicons 2)** — consistent icon set
- **React Hot Toast** — notification toasts
- **Axios** — HTTP client

### Backend

- **Node.js** + **Express 4**
- **MongoDB** with **Mongoose 8** ODM
- **JWT** (`jsonwebtoken`) — stateless authentication
- **bcryptjs** — password hashing
- **CORS** — cross-origin request handling
- **dotenv** — environment variable management

---

## 📁 Project Structure

```
expense/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile
│   │   └── transactionController.js  # CRUD + aggregation
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── errorMiddleware.js # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema (name, email, password)
│   │   └── Transaction.js     # Transaction schema (type, category, amount, date)
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   └── transactionRoutes.js  # /api/transactions/*
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js              # App entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instances & API helpers
│   │   ├── assets/
│   │   ├── components/        # Layout, SummaryCard, ChartContainer, etc.
│   │   ├── context/           # AuthContext (global auth state)
│   │   ├── pages/             # Dashboard, Transactions, Analytics, Settings, Login, Register
│   │   ├── utils/             # Formatters & helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Design tokens, glass morphism, layout system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **npm** (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev     # Development (with nodemon)
npm start       # Production
```

The API will run on **http://localhost:5000**.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will open on **http://localhost:5173**.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |

### Transactions (🔒 Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/transactions` | Create transaction |
| `GET` | `/api/transactions` | List transactions (filters, pagination, search) |
| `PUT` | `/api/transactions/:id` | Update transaction (owner only) |
| `DELETE` | `/api/transactions/:id` | Delete transaction (owner only) |
| `GET` | `/api/transactions/summary` | Monthly summary & category breakdown |

**Query Parameters** for `GET /api/transactions`:

| Param | Type | Description |
|-------|------|-------------|
| `type` | `income` \| `expense` | Filter by transaction type |
| `category` | `string` | Filter by category (regex) |
| `startDate` | ISO date | Start of date range |
| `endDate` | ISO date | End of date range |
| `search` | `string` | Search in description |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Items per page (default: 10) |
| `sort` | `string` | Sort field (default: `-date`) |

---

## 🎨 Design System

ExpenseIQ uses a custom CSS design system built on top of Tailwind CSS v4:

- **8px spacing scale** (`--space-1` through `--space-8`)
- **Semantic color tokens** — primary, accent, success, danger, warning
- **Glass morphism** — `.glass` and `.glass-card` utilities with backdrop blur
- **Gradient cards** — income (green), expense (red), balance (purple)
- **Dark mode** — CSS custom properties that swap on `.dark` class
- **Responsive grid** — 12-column grid with mobile/tablet/desktop breakpoints

---

## 📜 Available Scripts

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start with nodemon (auto-restart) |
| Production | `npm start` | Start with Node.js |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Vite dev server with HMR |
| Build | `npm run build` | Production build |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
