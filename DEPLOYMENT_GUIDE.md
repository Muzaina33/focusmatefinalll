# FocusMate Platform - Deployment Guide

## Overview
This guide will help you deploy FocusMate publicly so you can test it across devices (laptop as teacher, mobile as student).

## Deployment Requirements

### Critical Requirements for FocusMate
- **HTTPS Required**: WebRTC and camera access require HTTPS in production
- **WebSocket Support**: Real-time communication needs WebSocket connections
- **CORS Configuration**: Frontend and backend must be properly configured
- **Public Domain/IP**: Accessible from both laptop and mobile devices

## Recommended Deployment Options

### Option 1: Railway (Easiest - Recommended)
Railway provides free tier with HTTPS, WebSocket support, and easy deployment.

**Pros:**
- Automatic HTTPS
- WebSocket support out of the box
- Free tier available
- Simple GitHub integration
- Separate services for frontend/backend

**Steps:**
1. Sign up at https://railway.app
2. Create new project
3. Deploy backend service from GitHub
4. Deploy frontend service from GitHub
5. Configure environment variables
6. Get public URLs for both services

### Option 2: Render
Similar to Railway with good free tier.

**Pros:**
- Free tier with HTTPS
- WebSocket support
- Auto-deploy from GitHub

**Steps:**
1. Sign up at https://render.com
2. Create Web Service for backend
3. Create Static Site for frontend
4. Configure environment variables

### Option 3: Heroku
Reliable but requires credit card for free tier.

### Option 4: Self-Hosted with Ngrok (Quick Testing)
Use ngrok to expose your local server publicly.

**Pros:**
- Fastest setup for testing
- No deployment needed
- Free tier available

**Cons:**
- Temporary URLs (change on restart)
- Not suitable for production

## Quick Start: Deploy with Railway

### Step 1: Prepare Your Repository
Ensure your code is pushed to GitHub.

### Step 2: Backend Deployment

1. Go to https://railway.app and create account
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect the backend service
5. Add environment variables:
   ```
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=postgresql://... (Railway provides this)
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```
6. Set root directory to `backend`
7. Deploy

### Step 3: Frontend Deployment

1. In same Railway project, click "New Service"
2. Select your repository again
3. Set root directory to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_WS_URL=wss://your-backend-url.railway.app
   ```
5. Deploy

### Step 4: Update CORS Settings

Update `backend/app/main.py` with your Railway URLs:
```python
origins = [
    "https://your-frontend-url.railway.app",
    "http://localhost:5173",  # Keep for local dev
]
```

### Step 5: Test Deployment

1. Open frontend URL on laptop (teacher)
2. Open frontend URL on mobile (student)
3. Register accounts for both
4. Create session as teacher
5. Join session as student

## Alternative: Quick Testing with Ngrok

If you want to test immediately without full deployment:

### Step 1: Install Ngrok
```bash
# Download from https://ngrok.com/download
# Or use chocolatey on Windows:
choco install ngrok
```

### Step 2: Start Your Local Services
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev -- --host

# Terminal 3 - Ngrok for Backend
ngrok http 8000

# Terminal 4 - Ngrok for Frontend
ngrok http 5173
```

### Step 3: Update Configuration

1. Copy the ngrok URLs (they look like: https://abc123.ngrok.io)
2. Update frontend `.env`:
   ```
   VITE_API_URL=https://your-backend-ngrok-url.ngrok.io
   VITE_WS_URL=wss://your-backend-ngrok-url.ngrok.io
   ```
3. Update backend CORS in `main.py`:
   ```python
   origins = [
       "https://your-frontend-ngrok-url.ngrok.io",
   ]
   ```
4. Restart both services

### Step 4: Access from Devices
- Laptop: Open the frontend ngrok URL
- Mobile: Open the same frontend ngrok URL

## Configuration Files Needed

### Backend: railway.json (optional)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Frontend: Build Configuration
Ensure `frontend/package.json` has build script:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview --host --port $PORT"
  }
}
```

## Environment Variables Summary

### Backend (.env)
```
SECRET_KEY=your-secret-key-minimum-32-characters
DATABASE_URL=sqlite:///./focusmate.db  # or PostgreSQL URL
FRONTEND_URL=https://your-frontend-url
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url
VITE_WS_URL=wss://your-backend-url
```

## Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS (not HTTP)
- Check browser permissions
- Mobile browsers may have stricter camera policies

### WebSocket Connection Failed
- Verify WSS (not WS) protocol for HTTPS sites
- Check CORS configuration includes WebSocket upgrade headers
- Ensure backend allows WebSocket connections

### CORS Errors
- Add frontend URL to backend CORS origins
- Include credentials: true in CORS config
- Check that URLs match exactly (no trailing slashes)

## Testing Checklist

- [ ] Teacher can register and login on laptop
- [ ] Student can register and login on mobile
- [ ] Teacher can create session
- [ ] Student can join session with code
- [ ] Video streams work on both devices
- [ ] Camera access works on mobile
- [ ] LockMode toggle works
- [ ] Real-time attention updates visible
- [ ] WebSocket connection stable

## Next Steps

1. Choose deployment method (Railway recommended)
2. Deploy backend and frontend
3. Update environment variables
4. Test on both devices
5. Report any issues

## Cost Estimate

- **Railway Free Tier**: $0/month (500 hours, sufficient for testing)
- **Ngrok Free Tier**: $0/month (temporary URLs, good for quick tests)
- **Render Free Tier**: $0/month (with limitations)

For production use, expect $5-20/month depending on usage.
