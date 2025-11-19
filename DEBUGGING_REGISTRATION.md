# 🐛 Debugging Registration Issue

## Quick Checks

### 1. Check Backend is Running
Open browser: **http://localhost:8000**

You should see:
```json
{"message": "FocusMate API", "status": "running"}
```

If you don't see this, the backend is not running properly.

---

### 2. Check Browser Console for Errors

1. Open the registration page: http://localhost:5173/register
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to register
5. Look for red error messages

**Common errors:**
- `Network Error` - Backend not running
- `CORS error` - CORS configuration issue
- `404 Not Found` - Wrong API endpoint
- `500 Internal Server Error` - Backend error

---

### 3. Check Network Tab

1. Press **F12** → **Network** tab
2. Try to register
3. Look for the `/auth/register` request
4. Click on it to see:
   - **Status Code** (should be 201 or 200)
   - **Response** (error message if failed)
   - **Request Payload** (data being sent)

---

### 4. Check Backend Terminal

Look at your backend terminal for error messages when you try to register.

**You should see:**
```
INFO: "POST /auth/register HTTP/1.1" 201 Created
```

**If you see errors**, they will show what's wrong.

---

## Common Issues & Solutions

### Issue 1: "Network Error" or "Failed to fetch"

**Cause**: Backend is not running or wrong URL

**Solution**:
```bash
# In backend terminal
cd backend
venv\Scripts\activate
uvicorn app.main:socket_app --reload
```

Make sure you see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
Database initialized
WebSocket server ready
```

---

### Issue 2: "CORS Error"

**Cause**: Frontend URL not allowed by backend

**Check**: Backend terminal should show the request. If you see CORS error, the backend CORS settings need adjustment.

**Already Fixed**: The backend is configured to allow `http://localhost:5173`

---

### Issue 3: "Email already registered"

**Cause**: You already registered with that email

**Solution**: 
- Use a different email
- Or delete the database and restart:
  ```bash
  # In backend directory
  del focusmate.db
  python -m app.init_db
  uvicorn app.main:socket_app --reload
  ```

---

### Issue 4: "Validation Error"

**Cause**: Invalid email format or missing fields

**Solution**: Make sure you fill in:
- ✅ Full Name
- ✅ Valid email (e.g., test@example.com)
- ✅ Password (at least 6 characters)
- ✅ Role selected (Teacher or Student)

---

### Issue 5: Backend Shows Error

**Check backend terminal for:**

**Error: "No module named 'email_validator'"**
```bash
pip install email-validator
```

**Error: "Database error"**
```bash
# Reinitialize database
python -m app.init_db
```

---

## Step-by-Step Debugging

### Step 1: Verify Backend Health

Open browser: http://localhost:8000/docs

You should see **Swagger UI** with all API endpoints.

Try the `/auth/register` endpoint directly:
1. Click on **POST /auth/register**
2. Click **"Try it out"**
3. Fill in the example:
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "role": "teacher",
     "name": "Test User"
   }
   ```
4. Click **Execute**
5. Check the response

**If this works**, the backend is fine and the issue is in the frontend.

**If this fails**, check the backend error message.

---

### Step 2: Check Frontend API URL

1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh the page
4. Try to register again

---

### Step 3: Test with Simple Data

Try registering with:
- **Name**: Test Teacher
- **Email**: teacher@test.com
- **Password**: password123
- **Role**: Teacher

---

## Manual Test via Swagger UI

1. Open: http://localhost:8000/docs
2. Find **POST /auth/register**
3. Click **"Try it out"**
4. Enter:
   ```json
   {
     "email": "teacher@test.com",
     "password": "password123",
     "role": "teacher",
     "name": "Test Teacher"
   }
   ```
5. Click **Execute**

**Expected Response (201 Created):**
```json
{
  "id": "some-uuid",
  "email": "teacher@test.com",
  "role": "teacher",
  "name": "Test Teacher",
  "created_at": "2024-01-01T00:00:00"
}
```

If this works, the backend is fine!

---

## Quick Fix Commands

### Reset Everything:

**Backend:**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
del focusmate.db
python -m app.init_db
uvicorn app.main:socket_app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Browser:**
1. Press F12
2. Console tab
3. Type: `localStorage.clear()`
4. Refresh page

---

## What to Send Me for Help

If still not working, send me:

1. **Backend terminal output** (last 20 lines)
2. **Browser console errors** (screenshot or copy)
3. **Network tab** (screenshot of failed request)
4. **What you entered** (email, name, role)

---

## Expected Working Flow

### Backend Terminal:
```
INFO: "POST /auth/register HTTP/1.1" 201 Created
INFO: "POST /auth/login HTTP/1.1" 200 OK
INFO: "GET /auth/me HTTP/1.1" 200 OK
```

### Browser Console:
```
(No errors - should be clean)
```

### Result:
- ✅ Registration successful
- ✅ Auto-login
- ✅ Redirected to dashboard

---

## Still Having Issues?

Try this complete reset:

```bash
# Stop all terminals (Ctrl+C)

# Backend
cd backend
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
del focusmate.db
python -m app.init_db
uvicorn app.main:socket_app --reload

# Frontend (new terminal)
cd frontend
rmdir /s /q node_modules
npm install
npm run dev

# Browser
# Clear cache and cookies for localhost
# Or use Incognito mode
```

This will give you a completely fresh start! 🚀
