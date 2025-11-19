# Vercel + Render Deployment Fix Guide

## 🔍 Common Issue: Registration/Login Failed

This is usually caused by:
1. ❌ CORS configuration
2. ❌ Missing environment variables
3. ❌ Incorrect API URLs
4. ❌ Database not initialized

Let's fix them all!

---

## 🛠️ Step 1: Check Your URLs

### What are your deployment URLs?

**Frontend (Vercel)**: `https://your-app.vercel.app`
**Backend (Render)**: `https://your-backend.onrender.com`

Write them down! You'll need them.

---

## 🔧 Step 2: Fix Backend (Render)

### 2.1 Set Environment Variables in Render

1. Go to your Render dashboard
2. Click on your backend service
3. Go to **"Environment"** tab
4. Add these variables:

```
SECRET_KEY=focusmate-production-secret-key-change-this-to-something-random-and-long
DATABASE_URL=sqlite:///./focusmate.db
FRONTEND_URL=https://your-app.vercel.app
```

**IMPORTANT**: Replace `https://your-app.vercel.app` with YOUR actual Vercel URL!

### 2.2 Update Start Command in Render

In Render dashboard:
1. Go to **"Settings"** tab
2. Find **"Start Command"**
3. Set it to:
```
uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT
```

### 2.3 Check Build Command

Build Command should be:
```
pip install -r requirements.txt
```

### 2.4 Redeploy Backend

Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🎨 Step 3: Fix Frontend (Vercel)

### 3.1 Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Click on your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add these variables:

```
VITE_API_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com
```

**IMPORTANT**: Replace `https://your-backend.onrender.com` with YOUR actual Render URL!

**Note**: Use `wss://` (not `ws://`) for WebSocket URL!

### 3.2 Redeploy Frontend

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Check **"Use existing Build Cache"** = NO
4. Click **"Redeploy"**

---

## ✅ Step 4: Verify Backend is Working

### Test 1: Health Check

Open in browser:
```
https://your-backend.onrender.com/health
```

Should see:
```json
{"status":"healthy"}
```

✅ If you see this, backend is running!
❌ If you get an error, check Render logs.

### Test 2: API Docs

Open in browser:
```
https://your-backend.onrender.com/docs
```

Should see the FastAPI Swagger UI.

✅ If you see this, API is accessible!

---

## 🔍 Step 5: Check Browser Console

1. Open your Vercel frontend URL
2. Press `F12` to open Developer Tools
3. Go to **"Console"** tab
4. Try to register/login
5. Look for errors

### Common Errors and Fixes:

#### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Fix**: Backend CORS not configured correctly

1. Check `FRONTEND_URL` in Render environment variables
2. Make sure it matches your Vercel URL EXACTLY
3. No trailing slash: `https://your-app.vercel.app` ✅
4. Not: `https://your-app.vercel.app/` ❌
5. Redeploy backend

#### Error: "Network Error" or "Failed to fetch"

**Fix**: Wrong API URL

1. Check `VITE_API_URL` in Vercel environment variables
2. Make sure it matches your Render URL EXACTLY
3. Must use `https://` (not `http://`)
4. Redeploy frontend

#### Error: "401 Unauthorized" or "Invalid credentials"

**Fix**: Database not initialized or wrong credentials

1. Check Render logs for database errors
2. Try registering a new user first
3. Make sure password is correct

---

## 🐛 Step 6: Check Render Logs

1. Go to Render dashboard
2. Click on your backend service
3. Go to **"Logs"** tab
4. Look for errors

### Common Log Errors:

#### "ModuleNotFoundError: No module named 'X'"

**Fix**: Missing dependency

1. Check `requirements.txt` has all dependencies
2. Redeploy

#### "Database is locked"

**Fix**: SQLite issue on Render

Render's filesystem is ephemeral. You need to use PostgreSQL for production.

**Quick Fix** (for testing):
Add to your environment variables:
```
DATABASE_URL=sqlite:////tmp/focusmate.db
```

**Better Fix** (for production):
Use Render's PostgreSQL database (see Step 8 below)

---

## 📝 Step 7: Update Backend CORS (If Still Not Working)

If CORS errors persist, update `backend/app/main.py`:

<function_calls>
<invoke name="strReplace">
<parameter name="path">backend/app/main.py