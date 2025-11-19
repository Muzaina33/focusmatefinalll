# Ngrok Setup Guide - Free & Fast (5 Minutes)

## What is Ngrok?

Ngrok creates secure tunnels to your localhost, giving you public HTTPS URLs instantly. Perfect for testing across devices!

## Step 1: Install Ngrok (2 minutes)

### Windows

1. Go to https://ngrok.com/download
2. Download the Windows version (ZIP file)
3. Extract the ZIP file to a folder (e.g., `C:\ngrok`)
4. That's it! No installation needed.

### Sign Up (Optional but Recommended)

1. Go to https://dashboard.ngrok.com/signup
2. Sign up for free account
3. Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken
4. Run in command prompt:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

**Why sign up?** Free account gives you:
- Longer session times
- More simultaneous tunnels
- Custom subdomains (optional)

## Step 2: Start Your Local Services (1 minute)

Open **4 separate command prompt windows**:

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Wait until you see: `Uvicorn running on http://0.0.0.0:8000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev -- --host
```

Wait until you see: `Local: http://localhost:5173`

### Terminal 3 - Ngrok Backend Tunnel
```bash
cd C:\ngrok  # or wherever you extracted ngrok
ngrok http 8000
```

You'll see something like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:8000
```

**COPY THIS URL!** This is your backend URL.

### Terminal 4 - Ngrok Frontend Tunnel
```bash
cd C:\ngrok  # or wherever you extracted ngrok
ngrok http 5173
```

You'll see something like:
```
Forwarding    https://xyz789.ngrok.io -> http://localhost:5173
```

**COPY THIS URL!** This is your frontend URL.

## Step 3: Configure Environment Variables (2 minutes)

### Create frontend/.env

Create a new file `frontend/.env` with your ngrok URLs:

```env
VITE_API_URL=https://abc123.ngrok.io
VITE_WS_URL=wss://abc123.ngrok.io
```

**Replace `abc123.ngrok.io` with YOUR actual backend ngrok URL from Terminal 3!**

### Create backend/.env

Create a new file `backend/.env` with your ngrok URLs:

```env
SECRET_KEY=focusmate-secret-key-for-testing-only-change-in-production
DATABASE_URL=sqlite:///./focusmate.db
FRONTEND_URL=https://xyz789.ngrok.io
```

**Replace `xyz789.ngrok.io` with YOUR actual frontend ngrok URL from Terminal 4!**

## Step 4: Restart Services (1 minute)

### Stop and Restart Backend (Terminal 1)
1. Press `Ctrl+C` to stop
2. Run again:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Stop and Restart Frontend (Terminal 2)
1. Press `Ctrl+C` to stop
2. Run again:
   ```bash
   npm run dev -- --host
   ```

**Keep Terminals 3 & 4 (ngrok) running!**

## Step 5: Test! (1 minute)

### Verify Backend
Open in browser: `https://abc123.ngrok.io/health`

Should see: `{"status":"healthy"}`

### Verify Frontend
Open in browser: `https://xyz789.ngrok.io`

Should see the FocusMate landing page!

## Step 6: Test on Both Devices

### On Laptop (Teacher)
1. Open: `https://xyz789.ngrok.io` (your frontend ngrok URL)
2. Register as teacher
3. Create session
4. Note the session code

### On Mobile (Student)
1. Open: `https://xyz789.ngrok.io` (SAME URL as laptop)
2. Register as student
3. Enter session code
4. Join session

## 🎉 You're Done!

Both devices should now be connected and you can test:
- Video streaming
- Real-time attention monitoring
- LockMode functionality
- Activity feed updates

## 📋 Quick Reference

### Your URLs (Save These!)
```
Backend:  https://abc123.ngrok.io
Frontend: https://xyz789.ngrok.io

Use the FRONTEND URL on both devices!
```

### Terminal Layout
```
Terminal 1: Backend Server (python uvicorn)
Terminal 2: Frontend Server (npm run dev)
Terminal 3: Ngrok Backend Tunnel (ngrok http 8000)
Terminal 4: Ngrok Frontend Tunnel (ngrok http 5173)

Keep ALL 4 running while testing!
```

## 🔧 Troubleshooting

### "Ngrok not recognized as command"
**Solution**: Use full path to ngrok.exe:
```bash
C:\ngrok\ngrok.exe http 8000
```

### "CORS Error" in Browser
**Solution**: 
1. Check `backend/.env` has correct `FRONTEND_URL`
2. Make sure you restarted backend after creating .env
3. URLs must match exactly (no trailing slashes)

### "WebSocket Connection Failed"
**Solution**:
1. Check `frontend/.env` has `wss://` (not `ws://`)
2. Make sure backend ngrok URL is correct
3. Restart frontend after updating .env

### "Camera Not Working"
**Solution**:
1. Ngrok provides HTTPS automatically ✅
2. Check browser permissions
3. On mobile, allow camera in browser settings
4. Try Chrome or Safari

### Ngrok URLs Changed
**Solution**: 
- Free ngrok URLs change when you restart ngrok
- Update both `.env` files with new URLs
- Restart backend and frontend
- Or sign up for ngrok account to get stable URLs

## 💡 Tips

1. **Keep terminals visible**: You can see logs and errors
2. **Don't close ngrok terminals**: URLs will stop working
3. **Save your URLs**: Write them down for easy access
4. **Test on WiFi first**: Easier than mobile data
5. **Check all 4 terminals**: Make sure nothing crashed

## 🔄 Restarting Later

When you want to test again:

1. Start all 4 terminals in order (1, 2, 3, 4)
2. Copy new ngrok URLs (they change each time)
3. Update `.env` files with new URLs
4. Restart backend and frontend
5. Test again!

## ⚡ Even Faster Next Time

To avoid updating URLs every time, sign up for ngrok and use reserved domains:

1. Sign up at https://ngrok.com
2. Get 2 free reserved domains
3. Use them in your ngrok commands:
   ```bash
   ngrok http 8000 --domain=your-backend.ngrok-free.app
   ngrok http 5173 --domain=your-frontend.ngrok-free.app
   ```
4. URLs stay the same forever!

## 📞 Need Help?

Common issues:
- **Port already in use**: Close other apps using ports 8000 or 5173
- **Module not found**: Run `pip install -r requirements.txt` in backend
- **npm errors**: Run `npm install` in frontend
- **Database locked**: Delete `backend/focusmate.db` and restart

---

**Ready to test?** Follow the steps above and you'll be testing in 5 minutes! 🚀
