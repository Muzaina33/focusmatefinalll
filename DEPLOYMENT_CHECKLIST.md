# FocusMate Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Configuration

#### Backend Environment Variables
Create `backend/.env` with:
```bash
SECRET_KEY=your-super-secret-key-at-least-32-characters-long
DATABASE_URL=sqlite:///./focusmate.db
FRONTEND_URL=https://your-frontend-url.com
```

#### Frontend Environment Variables
Create `frontend/.env` with:
```bash
VITE_API_URL=https://your-backend-url.com
VITE_WS_URL=wss://your-backend-url.com
```

### 2. Code Verification
- [ ] All code committed to Git
- [ ] No sensitive data in code (API keys, passwords)
- [ ] `.gitignore` includes `.env` files
- [ ] Dependencies up to date

## Deployment Steps (Railway - Recommended)

### Backend Deployment

1. **Create Railway Account**
   - [ ] Sign up at https://railway.app
   - [ ] Connect GitHub account

2. **Deploy Backend Service**
   - [ ] Click "New Project" → "Deploy from GitHub repo"
   - [ ] Select your repository
   - [ ] Railway auto-detects Python app
   - [ ] Set root directory: `backend`
   - [ ] Add start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Configure Backend Environment**
   - [ ] Add `SECRET_KEY` variable
   - [ ] Add `FRONTEND_URL` (will update after frontend deploy)
   - [ ] Railway auto-provides `PORT` variable

4. **Get Backend URL**
   - [ ] Copy the Railway-provided URL (e.g., `https://focusmate-backend.railway.app`)
   - [ ] Save this for frontend configuration

### Frontend Deployment

1. **Deploy Frontend Service**
   - [ ] In same Railway project, click "New Service"
   - [ ] Select same GitHub repository
   - [ ] Set root directory: `frontend`
   - [ ] Add build command: `npm install && npm run build`
   - [ ] Add start command: `npm run preview -- --host --port $PORT`

2. **Configure Frontend Environment**
   - [ ] Add `VITE_API_URL` with backend URL
   - [ ] Add `VITE_WS_URL` with backend URL (use `wss://` for WebSocket)

3. **Get Frontend URL**
   - [ ] Copy the Railway-provided URL (e.g., `https://focusmate.railway.app`)

### Final Configuration

1. **Update Backend CORS**
   - [ ] Go back to backend service
   - [ ] Update `FRONTEND_URL` environment variable with actual frontend URL
   - [ ] Redeploy backend service

2. **Verify Deployment**
   - [ ] Backend health check: `https://your-backend-url/health`
   - [ ] Frontend loads: `https://your-frontend-url`
   - [ ] No CORS errors in browser console

## Testing Checklist

### Basic Functionality
- [ ] Frontend loads without errors
- [ ] Backend API responds to health check
- [ ] Registration page accessible
- [ ] Login page accessible

### Teacher Flow (Laptop)
- [ ] Register as teacher
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Can create new session
- [ ] Session code displayed
- [ ] Camera access works
- [ ] Video preview shows

### Student Flow (Mobile)
- [ ] Register as student
- [ ] Login successful
- [ ] Can enter session code
- [ ] Can join session
- [ ] Camera access works (mobile)
- [ ] Video stream visible
- [ ] Attention panel updates

### Real-Time Features
- [ ] WebSocket connection established
- [ ] Student appears in teacher's grid
- [ ] Teacher can see student video
- [ ] Student can see teacher video
- [ ] Attention metrics update in real-time
- [ ] LockMode toggle works
- [ ] Activity feed updates

### Browser Extension (Optional)
- [ ] Extension loads in Chrome
- [ ] LockMode prevents tab switching
- [ ] Popup shows connection status

## Troubleshooting

### Issue: CORS Errors
**Solution:**
- Verify `FRONTEND_URL` in backend matches exact frontend URL
- Check no trailing slashes in URLs
- Redeploy backend after changing environment variables

### Issue: WebSocket Connection Failed
**Solution:**
- Ensure using `wss://` (not `ws://`) for HTTPS sites
- Verify `VITE_WS_URL` matches backend URL
- Check browser console for specific error messages

### Issue: Camera Not Working
**Solution:**
- Ensure using HTTPS (required for camera access)
- Check browser permissions
- Mobile browsers may need explicit permission grant
- Try different browser if issues persist

### Issue: Video Not Showing
**Solution:**
- Check WebRTC connection in browser console
- Verify both users have camera access
- Check network allows WebRTC (some corporate networks block it)
- Try refreshing both pages

### Issue: 502 Bad Gateway
**Solution:**
- Check backend logs in Railway dashboard
- Verify start command is correct
- Ensure all dependencies installed
- Check Python version compatibility

## Alternative: Quick Test with Ngrok

If you want to test immediately without full deployment:

### Setup Ngrok
1. **Install Ngrok**
   ```bash
   # Download from https://ngrok.com/download
   ```

2. **Start Services Locally**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev -- --host

   # Terminal 3 - Ngrok Backend
   ngrok http 8000

   # Terminal 4 - Ngrok Frontend
   ngrok http 5173
   ```

3. **Configure with Ngrok URLs**
   - [ ] Copy ngrok URLs from terminal
   - [ ] Update `frontend/.env` with ngrok backend URL
   - [ ] Update `backend/.env` with ngrok frontend URL
   - [ ] Restart both services

4. **Access from Devices**
   - [ ] Laptop: Open ngrok frontend URL
   - [ ] Mobile: Open same ngrok frontend URL

## Post-Deployment

### Monitor Performance
- [ ] Check Railway logs for errors
- [ ] Monitor WebSocket connections
- [ ] Track API response times
- [ ] Watch for memory/CPU usage

### Security Checklist
- [ ] Change default SECRET_KEY
- [ ] Use strong passwords for test accounts
- [ ] Don't expose database publicly
- [ ] Keep dependencies updated

### Documentation
- [ ] Document deployment URLs
- [ ] Save environment variables securely
- [ ] Note any configuration changes
- [ ] Keep deployment credentials safe

## Support Resources

- Railway Docs: https://docs.railway.app
- Ngrok Docs: https://ngrok.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/
- Vite Production: https://vitejs.dev/guide/build.html

## Success Criteria

✅ Both devices can access the application
✅ Teacher can create and manage sessions
✅ Student can join and participate
✅ Real-time features work across devices
✅ Camera and video streaming functional
✅ No critical errors in logs

---

**Ready to deploy?** Start with Railway for the easiest experience, or use Ngrok for quick testing!
