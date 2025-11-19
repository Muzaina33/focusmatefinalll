# Vercel + Render Deployment Troubleshooting

## 🚨 Problem: Registration/Login Failed

Let's fix this step by step!

---

## ✅ Quick Checklist

Before we start, verify:

- [ ] Frontend deployed to Vercel successfully
- [ ] Backend deployed to Render successfully
- [ ] You have both URLs written down
- [ ] You can access both URLs in browser

---

## 🔧 Fix 1: Backend Environment Variables (Render)

### Go to Render Dashboard

1. Open https://dashboard.render.com
2. Click on your backend service
3. Click **"Environment"** in left sidebar
4. Add/Update these variables:

| Key | Value | Example |
|-----|-------|---------|
| `SECRET_KEY` | Any long random string | `focusmate-prod-key-12345678` |
| `DATABASE_URL` | SQLite path | `sqlite:////tmp/focusmate.db` |
| `FRONTEND_URL` | Your Vercel URL | `https://focusmate.vercel.app` |

### Important Notes:

- ✅ `FRONTEND_URL` must be EXACT Vercel URL
- ✅ No trailing slash: `https://app.vercel.app` (correct)
- ❌ Not: `https://app.vercel.app/` (wrong)
- ✅ Use `https://` (not `http://`)

### After Adding Variables:

Click **"Save Changes"** → Service will auto-redeploy

---

## 🎨 Fix 2: Frontend Environment Variables (Vercel)

### Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Click on your project
3. Click **"Settings"**
4. Click **"Environment Variables"**
5. Add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | Your Render backend URL | `https://focusmate-backend.onrender.com` |
| `VITE_WS_URL` | Your Render backend URL (wss) | `wss://focusmate-backend.onrender.com` |

### Important Notes:

- ✅ `VITE_API_URL` uses `https://`
- ✅ `VITE_WS_URL` uses `wss://` (not `ws://`)
- ✅ Both point to same Render URL
- ✅ No `/api` or other paths at the end

### After Adding Variables:

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Uncheck **"Use existing Build Cache"**
5. Click **"Redeploy"**

---

## 🧪 Fix 3: Test Backend Directly

### Test 1: Health Check

Open in browser:
```
https://YOUR-BACKEND.onrender.com/health
```

**Expected Response:**
```json
{"status":"healthy"}
```

✅ **If you see this**: Backend is running!
❌ **If you get error**: Check Render logs (see Fix 6)

### Test 2: API Documentation

Open in browser:
```
https://YOUR-BACKEND.onrender.com/docs
```

**Expected**: FastAPI Swagger UI page

✅ **If you see this**: API is accessible!
❌ **If you get error**: Backend not deployed correctly

### Test 3: Register Endpoint (Using Postman or curl)

```bash
curl -X POST "https://YOUR-BACKEND.onrender.com/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "role": "student",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "role": "student",
  "name": "Test User"
}
```

✅ **If you see this**: Backend auth is working!
❌ **If you get error**: See error-specific fixes below

---

## 🔍 Fix 4: Check Browser Console

### How to Check:

1. Open your Vercel frontend URL
2. Press `F12` (or right-click → Inspect)
3. Go to **"Console"** tab
4. Try to register/login
5. Look for red error messages

### Common Errors:

#### Error: "Access to XMLHttpRequest... has been blocked by CORS policy"

**Cause**: Backend CORS not configured for your Vercel URL

**Fix**:
1. Go to Render dashboard
2. Check `FRONTEND_URL` environment variable
3. Make sure it matches your Vercel URL EXACTLY
4. Redeploy backend
5. Clear browser cache and try again

#### Error: "Network Error" or "ERR_CONNECTION_REFUSED"

**Cause**: Wrong backend URL or backend is down

**Fix**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Make sure it matches your Render URL
3. Test backend health endpoint (see Fix 3)
4. If backend is down, check Render logs

#### Error: "Failed to fetch"

**Cause**: HTTPS/HTTP mismatch or CORS

**Fix**:
1. Make sure `VITE_API_URL` uses `https://` (not `http://`)
2. Make sure backend is using HTTPS (Render provides this automatically)
3. Check CORS configuration

---

## 📋 Fix 5: Check Network Tab

### How to Check:

1. Open your Vercel frontend URL
2. Press `F12`
3. Go to **"Network"** tab
4. Try to register/login
5. Look for the `/auth/register` or `/auth/login` request

### What to Look For:

#### Request URL:
Should be: `https://your-backend.onrender.com/auth/register`

❌ If it shows `http://localhost:8000/...`:
- Environment variables not set in Vercel
- Redeploy frontend after setting variables

#### Status Code:

- **200/201**: ✅ Success!
- **401**: Wrong credentials
- **409**: Email already registered
- **422**: Invalid data format
- **500**: Backend error (check Render logs)
- **0** or **CORS error**: CORS issue (see Fix 4)

#### Response:

Click on the request → **"Response"** tab

Look for error messages that explain the issue.

---

## 📊 Fix 6: Check Render Logs

### How to Check:

1. Go to Render dashboard
2. Click on your backend service
3. Click **"Logs"** in left sidebar
4. Look for errors (red text)

### Common Log Errors:

#### "ModuleNotFoundError: No module named 'X'"

**Fix**: Missing dependency in requirements.txt

1. Add the missing module to `backend/requirements.txt`
2. Commit and push to GitHub
3. Render will auto-redeploy

#### "Database is locked"

**Fix**: SQLite issue

Change `DATABASE_URL` to:
```
sqlite:////tmp/focusmate.db
```

This uses Render's temp directory.

#### "SECRET_KEY environment variable not set"

**Fix**: Add `SECRET_KEY` environment variable in Render

#### "Application startup failed"

**Fix**: Check the error message above this line

Usually indicates:
- Missing environment variable
- Database connection issue
- Import error

---

## 🔄 Fix 7: Update Backend Code (If Still Not Working)

If CORS errors persist, let's make the backend more permissive for testing:

### Option A: Allow All Origins (Testing Only!)

In `backend/app/main.py`, temporarily change:

```python
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**⚠️ WARNING**: This is insecure! Only use for testing. Remove after fixing.

### Option B: Add Specific Vercel Domains

In `backend/app/main.py`:

```python
# Get allowed origins
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "https://your-app.vercel.app",  # Add your exact Vercel URL
    "https://your-app-*.vercel.app",  # Allow preview deployments
]
```

---

## 🗄️ Fix 8: Database Issues (Advanced)

If you're getting database errors, SQLite might not work well on Render.

### Option A: Use PostgreSQL (Recommended for Production)

1. In Render dashboard, create a new PostgreSQL database
2. Copy the **Internal Database URL**
3. Set it as `DATABASE_URL` environment variable
4. Update `backend/requirements.txt`:
   ```
   psycopg2-binary==2.9.9
   ```
5. Redeploy

### Option B: Use Render Disk (Persistent SQLite)

1. In Render dashboard, go to your service
2. Click **"Settings"**
3. Scroll to **"Disks"**
4. Add a disk mounted at `/data`
5. Set `DATABASE_URL` to:
   ```
   sqlite:////data/focusmate.db
   ```
6. Redeploy

---

## ✅ Final Verification Checklist

After applying fixes:

- [ ] Backend health check returns `{"status":"healthy"}`
- [ ] Frontend loads without console errors
- [ ] Network tab shows requests going to correct URLs
- [ ] CORS errors are gone
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Token is saved in localStorage
- [ ] Dashboard loads after login

---

## 🆘 Still Not Working?

### Collect This Information:

1. **Frontend URL**: `https://_____.vercel.app`
2. **Backend URL**: `https://_____.onrender.com`
3. **Browser Console Error**: (screenshot or copy text)
4. **Network Tab**: (screenshot of failed request)
5. **Render Logs**: (copy last 50 lines)

### Quick Debug Commands:

```bash
# Test backend from command line
curl https://YOUR-BACKEND.onrender.com/health

# Test registration
curl -X POST "https://YOUR-BACKEND.onrender.com/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","role":"student","name":"Test"}'
```

---

## 📞 Common Solutions Summary

| Problem | Solution |
|---------|----------|
| CORS Error | Set `FRONTEND_URL` in Render to exact Vercel URL |
| Network Error | Set `VITE_API_URL` in Vercel to exact Render URL |
| 500 Error | Check Render logs for backend errors |
| Database Locked | Use `/tmp/` path or PostgreSQL |
| Module Not Found | Add to requirements.txt and redeploy |
| Wrong URL in requests | Redeploy frontend after setting env vars |

---

## 🎯 Most Common Fix (90% of cases)

1. **Render**: Set `FRONTEND_URL=https://your-exact-vercel-url.vercel.app`
2. **Vercel**: Set `VITE_API_URL=https://your-exact-render-url.onrender.com`
3. **Vercel**: Set `VITE_WS_URL=wss://your-exact-render-url.onrender.com`
4. Redeploy both services
5. Clear browser cache
6. Try again!

---

**Good luck! 🚀**
