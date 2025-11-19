# Quick Start: Deploy FocusMate for Testing

## Goal
Deploy FocusMate publicly so you can test with:
- **Laptop** → Teacher role
- **Mobile** → Student role

## Fastest Method: Railway (15 minutes)

### Step 1: Prepare Your Code (2 minutes)

1. Ensure all code is committed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Run pre-check (Windows):
   ```bash
   deploy-check.bat
   ```

### Step 2: Deploy Backend (5 minutes)

1. Go to https://railway.app and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your FocusMate repository
4. Railway will detect the backend automatically
5. Click on the service → **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Go to **Variables** tab and add:
   ```
   SECRET_KEY=focusmate-secret-key-change-this-in-production-12345
   ```
7. Click **Deploy**
8. Copy the backend URL (e.g., `https://focusmate-backend-production.up.railway.app`)

### Step 3: Deploy Frontend (5 minutes)

1. In the same Railway project, click **"New Service"**
2. Select **"GitHub Repo"** → Choose your repository again
3. Click on the service → **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --host --port $PORT`
4. Go to **Variables** tab and add (use your backend URL from Step 2):
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_WS_URL=wss://your-backend-url.railway.app
   ```
5. Click **Deploy**
6. Copy the frontend URL (e.g., `https://focusmate-production.up.railway.app`)

### Step 4: Update Backend CORS (2 minutes)

1. Go back to your **backend service** in Railway
2. Go to **Variables** tab
3. Add new variable (use your frontend URL from Step 3):
   ```
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```
4. Click **Redeploy** to apply changes

### Step 5: Test Deployment (1 minute)

1. Open backend health check in browser:
   ```
   https://your-backend-url.railway.app/health
   ```
   Should see: `{"status": "healthy"}`

2. Open frontend in browser:
   ```
   https://your-frontend-url.railway.app
   ```
   Should see the FocusMate landing page

## Testing Your Deployment

### On Laptop (Teacher)

1. Open: `https://your-frontend-url.railway.app`
2. Click **"Get Started"**
3. Register as **Teacher**:
   - Email: `teacher@test.com`
   - Password: `teacher123`
   - Name: `Test Teacher`
4. Create a new session
5. Note the **session code** (e.g., `ABC123`)
6. Allow camera access when prompted

### On Mobile (Student)

1. Open same URL: `https://your-frontend-url.railway.app`
2. Register as **Student**:
   - Email: `student@test.com`
   - Password: `student123`
   - Name: `Test Student`
3. Enter the **session code** from teacher
4. Click **"Join Session"**
5. Allow camera access when prompted

### What to Test

✅ **Video Streaming**
- Teacher sees student video
- Student sees teacher video

✅ **Real-Time Updates**
- Attention metrics update on teacher dashboard
- Student status changes reflect immediately

✅ **LockMode**
- Teacher toggles LockMode ON
- Student cannot switch tabs (if extension installed)

✅ **Activity Feed**
- Shows when student joins
- Shows attention changes
- Shows tab switch attempts

## Alternative: Ngrok (5 minutes, temporary URLs)

If you want to test RIGHT NOW without deployment:

### Step 1: Install Ngrok
Download from: https://ngrok.com/download

### Step 2: Start Local Services

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev -- --host
```

**Terminal 3 - Ngrok Backend:**
```bash
ngrok http 8000
```
Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

**Terminal 4 - Ngrok Frontend:**
```bash
ngrok http 5173
```
Copy the HTTPS URL (e.g., `https://xyz789.ngrok.io`)

### Step 3: Update Configuration

1. Create `frontend/.env`:
   ```
   VITE_API_URL=https://abc123.ngrok.io
   VITE_WS_URL=wss://abc123.ngrok.io
   ```

2. Update `backend/app/main.py` line 13:
   ```python
   FRONTEND_URL = os.getenv("FRONTEND_URL", "https://xyz789.ngrok.io")
   ```

3. Restart both services (Terminal 1 & 2)

### Step 4: Access from Devices

- **Laptop**: Open `https://xyz789.ngrok.io`
- **Mobile**: Open `https://xyz789.ngrok.io`

**Note**: Ngrok URLs change every time you restart, so this is only for quick testing.

## Troubleshooting

### "CORS Error" in Browser Console
**Fix**: Make sure `FRONTEND_URL` in backend matches your actual frontend URL exactly

### "WebSocket Connection Failed"
**Fix**: Ensure you're using `wss://` (not `ws://`) in `VITE_WS_URL`

### "Camera Access Denied"
**Fix**: 
- Must use HTTPS (Railway provides this automatically)
- Check browser permissions
- On mobile, may need to explicitly allow camera in browser settings

### "502 Bad Gateway"
**Fix**: Check Railway logs for errors. Usually means:
- Start command is wrong
- Dependencies failed to install
- Python version mismatch

### Videos Not Showing
**Fix**:
- Check both users have camera access
- Verify WebSocket connection is established
- Try refreshing both pages
- Check browser console for WebRTC errors

## Success Checklist

- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and loads
- [ ] Teacher can register and login
- [ ] Student can register and login
- [ ] Teacher can create session
- [ ] Student can join with code
- [ ] Both cameras work
- [ ] Video streams visible on both devices
- [ ] Attention metrics update in real-time
- [ ] LockMode toggle works

## Next Steps

Once deployed and tested:
1. Share the frontend URL with others to test
2. Monitor Railway logs for any errors
3. Consider adding custom domain (Railway supports this)
4. Set up proper database (PostgreSQL) for production use

## Cost

- **Railway Free Tier**: $0/month (500 hours)
- **Ngrok Free Tier**: $0/month (temporary URLs)

Perfect for testing! 🚀

---

**Need help?** Check the full guides:
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `README.md` - Project overview
