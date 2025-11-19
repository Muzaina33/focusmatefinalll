# 🖥️ FocusMate Terminal Guide

## What Should Be Happening in Each Terminal

### 📊 Terminal Overview

You need **3 terminals** running simultaneously for the full FocusMate experience:

```
Terminal 1: Backend Server (FastAPI)
Terminal 2: Frontend Server (Vite/React)
Terminal 3: AI Engine (Optional for testing)
```

---

## 🔴 Terminal 1: Backend Server

### What to Run:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:socket_app --reload
```

### What You Should See:

```
INFO:     Will watch for changes in these directories: ['C:\\...\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
Database initialized
WebSocket server ready
INFO:     Application startup complete.
```

### What It Means:
- ✅ **Database initialized** - SQLite database created with all tables
- ✅ **WebSocket server ready** - Real-time communication ready
- ✅ **Running on http://127.0.0.1:8000** - API is accessible

### What It's Doing:
- 🔹 Handling authentication (register/login)
- 🔹 Managing rooms (create/join/leave)
- 🔹 Processing WebSocket events (real-time updates)
- 🔹 Storing attention data in database
- 🔹 Serving API endpoints

### When Students/Teachers Connect:
```
INFO:     127.0.0.1:54321 - "POST /auth/login HTTP/1.1" 200 OK
INFO:     127.0.0.1:54322 - "POST /room/create HTTP/1.1" 201 Created
Client connected: abc123def456
User authenticated: teacher@test.com
INFO:     127.0.0.1:54323 - "POST /room/join HTTP/1.1" 200 OK
Client connected: xyz789ghi012
User authenticated: student@test.com
```

### Common Issues:

**Error: "Address already in use"**
```bash
# Kill the process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

**Error: "No module named 'app'"**
```bash
# Make sure you're in the backend directory
cd backend
# Reinstall dependencies
pip install -r requirements.txt
```

---

## 🟢 Terminal 2: Frontend Server

### What to Run:
```bash
cd frontend
npm install
npm run dev
```

### What You Should See:

```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### What It Means:
- ✅ **Vite server running** - React app is compiled and ready
- ✅ **http://localhost:5173/** - Frontend is accessible
- ✅ **Hot reload enabled** - Changes update instantly

### What It's Doing:
- 🔹 Serving React application
- 🔹 Compiling TypeScript to JavaScript
- 🔹 Processing Tailwind CSS
- 🔹 Hot-reloading on file changes
- 🔹 Proxying API requests to backend

### When You Navigate:
```
10:30:45 AM [vite] page reload src/pages/LoginPage.tsx
10:31:02 AM [vite] hmr update /src/store/authStore.ts
```

### Common Issues:

**Error: "EADDRINUSE: address already in use"**
```bash
# Kill the process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

**Error: "Cannot find module"**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🟡 Terminal 3: AI Engine (Optional)

### What to Run:
```bash
cd backend/app/ai
pip install -r requirements.txt
python ai_engine.py
```

### What You Should See:

```
FocusMate AI Engine
==================================================
FocusMate AI Engine starting...
AI Engine will be implemented in tasks 8-12
Waiting for implementation...
```

### What It Means:
- ✅ **AI Engine started** - Face detection ready
- ✅ **Waiting for video input** - Ready to process frames

### What It's Doing:
- 🔹 Waiting for student video streams
- 🔹 Processing frames at 30 FPS
- 🔹 Detecting faces with Mediapipe
- 🔹 Analyzing attention (EAR, head pose, blinks)
- 🔹 Sending updates to backend via WebSocket

### When Processing Video:
```
Starting AI Engine for student student-123 in session session-456
Connected to backend: http://localhost:8000
Frame 30: Score=85.3, Status=Engaged
Frame 60: Score=78.1, Status=Present
Frame 90: Score=45.2, Status=Looking Away
Frame 120: Score=92.7, Status=Engaged
```

### Common Issues:

**Error: "No module named 'cv2'"**
```bash
pip install opencv-python
```

**Error: "No module named 'mediapipe'"**
```bash
pip install mediapipe
```

**Error: "Camera not found"**
- This is normal if no camera is connected
- AI Engine will wait for video input from students

---

## 🌐 Browser Extension

### How to Load:

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **"Developer mode"** (top right toggle)
4. Click **"Load unpacked"**
5. Select the `extension` folder
6. Extension should load successfully now (icons fixed!)

### What You Should See:
- ✅ Extension appears in list
- ✅ No errors
- ✅ Can click extension icon to see popup

### What It's Doing:
- 🔹 Monitoring tab switches
- 🔹 Enforcing LockMode when enabled
- 🔹 Logging events to backend
- 🔹 Showing LockMode status in popup

### When LockMode is Active:
```
(In extension console - chrome://extensions/ → Details → Inspect views: background page)

FocusMate Extension: Background service worker loaded
LockMode initialized: { classroomTabId: 123, sessionId: 'abc', lockModeEnabled: true }
Tab switch detected
Tab switch logged: { wasBlocked: true }
```

---

## 🎯 Complete Workflow Example

### Scenario: Teacher Creates Session, Student Joins

**Terminal 1 (Backend):**
```
INFO:     127.0.0.1:54321 - "POST /auth/login HTTP/1.1" 200 OK
INFO:     127.0.0.1:54322 - "POST /room/create HTTP/1.1" 201 Created
Client connected: teacher-socket-id
User authenticated: teacher@test.com

INFO:     127.0.0.1:54323 - "POST /room/join HTTP/1.1" 200 OK
Client connected: student-socket-id
User authenticated: student@test.com
```

**Terminal 2 (Frontend):**
```
10:30:00 AM [vite] page reload src/pages/TeacherDashboard.tsx
10:30:15 AM [vite] page reload src/pages/StudentClassroom.tsx
```

**Terminal 3 (AI Engine):**
```
Starting AI Engine for student student-123 in session session-456
Connected to backend: http://localhost:8000
Frame 30: Score=85.3, Status=Engaged
Frame 60: Score=78.1, Status=Present
```

**Browser Extension Console:**
```
FocusMate Extension: Content script loaded
Student classroom detected
LockMode initialized: { sessionId: 'session-456', enabled: false }
```

---

## 🔍 How to Check Everything is Working

### 1. Backend Health Check
Open browser: http://localhost:8000
Should see: `{"message": "FocusMate API", "status": "running"}`

### 2. API Documentation
Open browser: http://localhost:8000/docs
Should see: Swagger UI with all endpoints

### 3. Frontend
Open browser: http://localhost:5173
Should see: FocusMate landing page with dark theme

### 4. WebSocket Connection
Open browser console (F12) on http://localhost:5173
Should see: `WebSocket connected` (after login)

### 5. Extension
Click extension icon in Chrome
Should see: Popup with "LockMode: OFF"

---

## 🐛 Debugging Tips

### Check Backend Logs
Look for errors in Terminal 1:
- Database errors
- Authentication failures
- WebSocket disconnections

### Check Frontend Console
Press F12 in browser:
- Network errors (red in Network tab)
- JavaScript errors (red in Console tab)
- WebSocket status (look for "WebSocket connected")

### Check Extension Console
Go to `chrome://extensions/` → Details → Inspect views:
- Background page console
- Content script console (in page F12)

---

## ✅ Success Indicators

### Backend is Working:
- ✅ "Database initialized" message
- ✅ "WebSocket server ready" message
- ✅ No error messages
- ✅ Can access http://localhost:8000

### Frontend is Working:
- ✅ Vite server running message
- ✅ Can access http://localhost:5173
- ✅ Page loads with dark theme
- ✅ No console errors

### AI Engine is Working:
- ✅ "FocusMate AI Engine starting..." message
- ✅ No import errors
- ✅ Waiting for video input

### Extension is Working:
- ✅ Loads without errors
- ✅ Popup displays correctly
- ✅ No errors in extension console

---

## 🚀 Quick Start Commands

### Start Everything (3 separate terminals):

**Terminal 1:**
```bash
cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:socket_app --reload
```

**Terminal 2:**
```bash
cd frontend && npm install && npm run dev
```

**Terminal 3:**
```bash
cd backend/app/ai && pip install -r requirements.txt && python ai_engine.py
```

---

## 📞 Need Help?

If you see errors:
1. Check this guide for common issues
2. Read error messages carefully
3. Check INSTALLATION.md for detailed setup
4. Verify all prerequisites are installed

**Happy coding! 🎓✨**
