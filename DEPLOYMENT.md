# 🚀 Deployment Guide — ExpenseIQ

## Prerequisites
- MongoDB Atlas account (free tier works)
- GitHub repository with your code
- Render account (backend)
- Vercel account (frontend)

---

## 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → Create a free cluster.
2. Create a database user with a strong password.
3. In **Network Access**, add `0.0.0.0/0` to allow access from any IP (required for Render).
4. Copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

---

## 2. Deploy Backend to Render

1. Push your code to GitHub.
2. Go to [Render](https://render.com) → **New → Web Service**.
3. Connect your GitHub repo → set **Root Directory** to `backend`.
4. Configure:
   | Setting | Value |
   |---------|-------|
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |
5. Add **Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://...your-atlas-uri...
   JWT_SECRET=your_production_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=production
   PORT=5000
   ```
6. Click **Create Web Service** → Render will build and deploy automatically.
7. Copy the deployed URL (e.g. `https://expense-tracker-api.onrender.com`).

---

## 3. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) → **New Project**.
2. Import your GitHub repo → set **Root Directory** to `frontend`.
3. Framework preset will auto-detect **Vite**.
4. Add **Environment Variable**:
   ```
   VITE_API_URL=https://expense-tracker-api.onrender.com/api
   ```
5. Click **Deploy**.

### Update Axios Base URL for Production

In `frontend/src/api/axios.js`, update the `baseURL`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
```

---

## 4. Environment Variable Reference

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=production
```

### Frontend `.env`
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 5. Post-Deployment Checklist

- [ ] Backend health check: visit `https://your-backend.onrender.com/` → should return JSON
- [ ] Frontend loads at Vercel URL
- [ ] Register a new user
- [ ] Login works and persists across refresh
- [ ] CRUD operations for transactions work
- [ ] Charts render on the dashboard
- [ ] Dark mode toggle works
- [ ] CSV export downloads properly
