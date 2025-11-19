# Ngrok Setup - Visual Step-by-Step Guide

## 🎯 Goal: Test FocusMate on Laptop + Mobile (FREE!)

```
┌─────────────┐                    ┌─────────────┐
│   LAPTOP    │                    │   MOBILE    │
│  (Teacher)  │◄──────────────────►│  (Student)  │
└─────────────┘                    └─────────────┘
       │                                  │
       └──────────────┬───────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  Ngrok Tunnel │
              │   (FREE!)     │
              └───────────────┘
                      │
                      ▼
              ┌───────────────┐
              │ Your Computer │
              │  (localhost)  │
              └───────────────┘
```

## 📥 Step 1: Download Ngrok

### What to do:
1. Open browser
2. Go to: **https://ngrok.com/download**
3. Click **"Download for Windows"**
4. Save the ZIP file

### What you'll see:
```
Downloads folder:
📁 ngrok-v3-stable-windows-amd64.zip
```

### Extract it:
1. Right-click the ZIP file
2. Click **"Extract All"**
3. Choose location: `C:\ngrok`
4. Click **"Extract"**

### Result:
```
C:\ngrok\
  └── ngrok.exe  ← This is what you need!
```

## 🔑 Step 2: Sign Up (Optional but Recommended)

### Why sign up?
- ✅ Longer session times
- ✅ More stable connections
- ✅ Better performance

### How to sign up:
1. Go to: **https://dashboard.ngrok.com/signup**
2. Sign up with email or Google
3. Go to: **https://dashboard.ngrok.com/get-started/your-authtoken**
4. Copy your auth token

### Add auth token:
```bash
cd C:\ngrok
ngrok config add-authtoken YOUR_TOKEN_HERE
```

**You only need to do this once!**

## 🖥️ Step 3: Open 4 Terminal Windows

### Terminal Layout:
```
┌─────────────────────┐  ┌─────────────────────┐
│   Terminal 1        │  │   Terminal 2        │
│   Backend Server    │  │   Frontend Server   │
│                     │  │                     │
│   Port: 8000        │  │   Port: 5173        │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│   Terminal 3        │  │   Terminal 4        │
│   Ngrok Backend     │  │   Ngrok Frontend    │
│                     │  │                     │
│   Tunnel: 8000      │  │   Tunnel: 5173      │
└─────────────────────┘  └─────────────────────┘
```

### How to open terminals:
1. Press `Win + R`
2. Type `cmd`
3. Press Enter
4. Repeat 4 times!

## 🚀 Step 4: Start Backend (Terminal 1)

### Commands:
```bash
cd C:\path\to\focusmate\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### What you'll see:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
Database initialized
WebSocket server ready
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

✅ **Success!** Backend is running.

**Keep this terminal open!**

## 🎨 Step 5: Start Frontend (Terminal 2)

### Commands:
```bash
cd C:\path\to\focusmate\frontend
npm run dev -- --host
```

### What you'll see:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h to show help
```

✅ **Success!** Frontend is running.

**Keep this terminal open!**

## 🌐 Step 6: Start Ngrok Backend Tunnel (Terminal 3)

### Commands:
```bash
cd C:\ngrok
ngrok http 8000
```

### What you'll see:
```
ngrok

Session Status                online
Account                       your-email@example.com
Version                       3.0.0
Region                        United States (us)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 🎯 IMPORTANT: Copy this URL!
```
https://abc123def456.ngrok.io
```

This is your **BACKEND URL**. Write it down!

**Keep this terminal open!**

## 🌐 Step 7: Start Ngrok Frontend Tunnel (Terminal 4)

### Commands:
```bash
cd C:\ngrok
ngrok http 5173
```

### What you'll see:
```
ngrok

Session Status                online
Account                       your-email@example.com
Version                       3.0.0
Region                        United States (us)
Latency                       50ms
Web Interface                 http://127.0.0.1:4041
Forwarding                    https://xyz789ghi012.ngrok.io -> http://localhost:5173

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 🎯 IMPORTANT: Copy this URL!
```
https://xyz789ghi012.ngrok.io
```

This is your **FRONTEND URL**. Write it down!

**Keep this terminal open!**

## 📝 Step 8: Create Environment Files

### Create frontend/.env

1. Open `frontend` folder
2. Create new file: `.env`
3. Add this content (use YOUR URLs!):

```env
VITE_API_URL=https://abc123def456.ngrok.io
VITE_WS_URL=wss://abc123def456.ngrok.io
```

**Replace with YOUR backend ngrok URL from Step 6!**

### Create backend/.env

1. Open `backend` folder
2. Create new file: `.env`
3. Add this content (use YOUR URLs!):

```env
SECRET_KEY=focusmate-secret-key-for-testing-change-in-production
DATABASE_URL=sqlite:///./focusmate.db
FRONTEND_URL=https://xyz789ghi012.ngrok.io
```

**Replace with YOUR frontend ngrok URL from Step 7!**

## 🔄 Step 9: Restart Backend and Frontend

### Restart Backend (Terminal 1):
1. Press `Ctrl + C` to stop
2. Run again:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Restart Frontend (Terminal 2):
1. Press `Ctrl + C` to stop
2. Run again:
   ```bash
   npm run dev -- --host
   ```

**Don't restart Terminals 3 & 4 (ngrok)!**

## ✅ Step 10: Test It!

### Test Backend:
Open browser: `https://abc123def456.ngrok.io/health`

Should see:
```json
{"status":"healthy"}
```

### Test Frontend:
Open browser: `https://xyz789ghi012.ngrok.io`

Should see:
```
┌─────────────────────────────┐
│   🎓 FocusMate Platform     │
│                             │
│   AI-Powered Virtual        │
│   Classroom                 │
│                             │
│   [Get Started]  [Login]    │
└─────────────────────────────┘
```

## 📱 Step 11: Test on Both Devices!

### On Laptop (Teacher):

1. Open: `https://xyz789ghi012.ngrok.io`
2. Click **"Get Started"**
3. Fill registration form:
   - Email: `teacher@test.com`
   - Password: `teacher123`
   - Role: **Teacher**
   - Name: `Test Teacher`
4. Click **"Register"**
5. Click **"Create New Session"**
6. **Copy the session code** (e.g., `ABC123`)

### On Mobile (Student):

1. Open: `https://xyz789ghi012.ngrok.io` (SAME URL!)
2. Click **"Get Started"**
3. Fill registration form:
   - Email: `student@test.com`
   - Password: `student123`
   - Role: **Student**
   - Name: `Test Student`
4. Click **"Register"**
5. Enter the **session code** from teacher
6. Click **"Join Session"**

## 🎉 Success Indicators

### On Teacher's Laptop:
```
┌─────────────────────────────────┐
│  Teacher Dashboard              │
│                                 │
│  Session: ABC123                │
│                                 │
│  Students (1):                  │
│  ┌─────────────┐                │
│  │ Test Student│                │
│  │ 📹 Video    │                │
│  │ Score: 85%  │                │
│  └─────────────┘                │
│                                 │
│  [🔒 LockMode: OFF]             │
└─────────────────────────────────┘
```

### On Student's Mobile:
```
┌──────────────────┐
│ Student View     │
│                  │
│ Your Video:      │
│ ┌──────────────┐ │
│ │   📹        │ │
│ └──────────────┘ │
│                  │
│ Attention: 85%   │
│ Status: Engaged  │
│                  │
│ [Leave Class]    │
└──────────────────┘
```

## 🔧 Troubleshooting

### Problem: "Ngrok not found"
```
Solution:
1. Use full path: C:\ngrok\ngrok.exe http 8000
2. Or add C:\ngrok to PATH
```

### Problem: "CORS Error"
```
Solution:
1. Check backend/.env has correct FRONTEND_URL
2. Restart backend (Terminal 1)
3. Clear browser cache
```

### Problem: "WebSocket Failed"
```
Solution:
1. Check frontend/.env uses wss:// (not ws://)
2. Verify backend URL is correct
3. Restart frontend (Terminal 2)
```

### Problem: "Camera Not Working"
```
Solution:
1. Ngrok provides HTTPS ✅
2. Check browser permissions
3. Allow camera in browser settings
4. Try different browser
```

## 📊 Terminal Status Check

All 4 terminals should show:

```
✅ Terminal 1: Backend running (no errors)
✅ Terminal 2: Frontend running (no errors)
✅ Terminal 3: Ngrok backend (showing connections)
✅ Terminal 4: Ngrok frontend (showing connections)
```

## 💡 Pro Tips

1. **Save your URLs**: Write them in a notepad
2. **Keep terminals visible**: Easy to spot errors
3. **Test on WiFi first**: More stable than mobile data
4. **Use Chrome/Safari**: Best WebRTC support
5. **Allow all permissions**: Camera, microphone, etc.

## 🔄 Next Time You Test

1. Start all 4 terminals again
2. Ngrok URLs will be DIFFERENT
3. Update both `.env` files with new URLs
4. Restart backend and frontend
5. Test again!

---

**You're all set!** Follow these steps and you'll be testing in minutes! 🚀
