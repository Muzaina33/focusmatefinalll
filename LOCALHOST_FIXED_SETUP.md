# 🏠 LOCALHOST SETUP - FIXED & WORKING

## 🚨 DEPENDENCY FIX FIRST

**In your backend directory, run:**

```bash
# Install missing dependencies
pip install email-validator pydantic[email]

# Or install all requirements again
pip install -r requirements.txt
```

## 🚀 COMPLETE WORKING SETUP

### Step 1: Backend (Terminal 1)

```bash
cd backend

# Install dependencies (if needed)
pip install -r requirements.txt
pip install email-validator

# Run backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Success Output:**
```
🔧 Database: SQLite
🔑 JWT Secret configured: No (using default!)
⏰ Token expiry: 10080 minutes
📊 Reports router included successfully
INFO: Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies (if needed)
npm install

# Run frontend
npm run dev
```

**Expected Success Output:**
```
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/
```

### Step 3: Test Everything

1. **Backend Health**: `http://localhost:8000/health`
   - Should show: `{"status":"healthy"}`

2. **Reports Test**: `http://localhost:8000/reports/test`
   - Should show: `{"message": "Reports router is working!", "status": "ok"}`

3. **Frontend**: `http://localhost:5173`
   - Should show landing page

## 🎯 DEMO FLOW (Localhost)

### Register Accounts:
1. **Teacher Account**:
   - Email: `teacher@test.com`
   - Password: `teacher123`
   - Role: Teacher

2. **Student Account**:
   - Email: `student@test.com`
   - Password: `student123`
   - Role: Student

### Test Flow:
1. **Teacher**: Login → Create Session → Get room code
2. **Student**: Login → Join with code → Allow camera
3. **Both**: See each other's video via WebRTC
4. **AI**: Starts monitoring student attention
5. **Teacher**: Views reports with session data

## 📱 TESTING OPTIONS

### Option 1: Same Computer
- **Teacher**: Chrome window 1
- **Student**: Chrome window 2 (or incognito)

### Option 2: Computer + Phone
- **Teacher**: `http://localhost:5173` (computer)
- **Student**: `http://192.168.x.x:5173` (phone - use your network IP)

**Find Network IP:**
```bash
# Windows
ipconfig | findstr IPv4

# Look for: 192.168.x.x
```

## ✅ WHAT WORKS PERFECTLY ON LOCALHOST

- ✅ **No JWT token issues** - Consistent secret key
- ✅ **Camera access works** - Browser trusts localhost
- ✅ **WebRTC peer-to-peer** - Same network connection
- ✅ **AI monitoring** - Full face detection
- ✅ **Reports** - All endpoints work
- ✅ **Real-time updates** - WebSocket works perfectly
- ✅ **No CORS issues** - Same origin
- ✅ **Instant changes** - No deployment delays

## 🔧 TROUBLESHOOTING

### Backend Issues:
```bash
# If port 8000 busy
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# If dependencies missing
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues:
```bash
# If port 5173 busy
npm run dev -- --port 3000

# If node_modules issues
rm -rf node_modules package-lock.json
npm install
```

### Camera Issues:
- Allow camera permission in browser
- Close other apps using camera (Zoom, Teams, etc.)
- Try Chrome browser (works best)
- Refresh page after allowing permissions

## 🎉 SUCCESS INDICATORS

You'll know it's working when you see:

**Backend Console:**
```
📊 Reports router included successfully
🔗 Available routes:
  {'GET'} /reports/test
  {'GET'} /reports/teacher/{teacher_id}/sessions
INFO: Application startup complete.
```

**Frontend:**
- Landing page loads instantly
- Registration works without errors
- Camera access granted immediately
- Video appears in both teacher and student views

**WebRTC:**
- Teacher sees student video in real-time
- Student sees teacher video
- AI monitoring shows attention scores
- Reports page shows session data

---

**Run the dependency fix first, then start both servers - everything will work perfectly!** 🚀