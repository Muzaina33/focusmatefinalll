# Quick Fix: Vercel + Render Login/Registration Issue

## 🎯 Most Likely Cause: Environment Variables

Follow these steps in order:

---

## Step 1: Fix Render Backend (2 minutes)

### Go to Render Dashboard:
1. Open: https://dashboard.render.com
2. Click your backend service
3. Click **"Environment"** tab
4. Add these 3 variables:

```
SECRET_KEY = focusmate-production-secret-key-12345
DATABASE_URL = sqlite:////tmp/focusmate.db
FRONTEND_URL = https://YOUR-VERCEL-URL.vercel.app
```

**⚠️ IMPORTANT**: Replace `YOUR-VERCEL-URL` with your actual Vercel URL!

Example: `https://focusmate-abc123.vercel.app`

5. Click **"Save Changes"**
6. Wait for auto-redeploy (2-3 minutes)

---

## Step 2: Fix Vercel Frontend (2 minutes)

### Go to Vercel Dashboard:
1. Open: https://vercel.com/dashboard
2. Click your project
3. Click **"Settings"** → **"Environment Variables"**
4. Add these 2 variables:

```
VITE_API_URL = https://YOUR-RENDER-URL.onrender.com
VITE_WS_URL = wss://YOUR-RENDER-URL.onrender.com
```

**⚠️ IMPORTANT**: Replace `YOUR-RENDER-URL` with your actual Render URL!

Example: `https://focusmate-backend.onrender.com`

**Note**: Use `wss://` for WebSocket URL (not `ws://`)!

5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"..."** on latest deployment → **"Redeploy"**
8. Uncheck **"Use existing Build Cache"**
9. Click **"Redeploy"**
10. Wait for deployment (1-2 minutes)

---

## Step 3: Test Backend (1 minute)

Open in browser:
```
https://YOUR-RENDER-URL.onrender.com/health
```

**Should see:**
```json
{"status":"healthy"}
```

✅ If yes: Backend is working!
❌ If no: Check Render logs for errors

---

## Step 4: Test Frontend (1 minute)

1. Open your Vercel URL
2. Press `F12` to open Developer Tools
3. Go to **"Console"** tab
4. Try to register/login
5. Look for errors

### If you see CORS error:
- Double-check `FRONTEND_URL` in Render matches your Vercel URL EXACTLY
- No trailing slash!
- Redeploy backend

### If you see "Network Error":
- Double-check `VITE_API_URL` in Vercel matches your Render URL EXACTLY
- Must use `https://` (not `http://`)
- Redeploy frontend

---

## Step 5: Clear Cache and Try Again

1. Clear browser cache (Ctrl+Shift+Delete)
2. Close all browser tabs
3. Open your Vercel URL in new tab
4. Try to register with a new email
5. Try to login

---

## ✅ Success Checklist

- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] Can register new user
- [ ] Can login with user
- [ ] Dashboard loads after login

---

## 🚨 Still Not Working?

### Check These Common Mistakes:

1. **URLs don't match**
   - `FRONTEND_URL` in Render must match your Vercel URL
   - `VITE_API_URL` in Vercel must match your Render URL

2. **Trailing slashes**
   - ❌ `https://app.vercel.app/`
   - ✅ `https://app.vercel.app`

3. **HTTP vs HTTPS**
   - ❌ `http://app.onrender.com`
   - ✅ `https://app.onrender.com`

4. **WebSocket protocol**
   - ❌ `ws://app.onrender.com`
   - ✅ `wss://app.onrender.com`

5. **Forgot to redeploy**
   - After changing environment variables, you MUST redeploy!

---

## 📋 Your URLs (Fill This Out)

```
Frontend (Vercel):  https://_________________.vercel.app
Backend (Render):   https://_________________.onrender.com
```

### Environment Variables to Set:

**Render (Backend):**
```
FRONTEND_URL = https://_________________.vercel.app
```

**Vercel (Frontend):**
```
VITE_API_URL = https://_________________.onrender.com
VITE_WS_URL = wss://_________________.onrender.com
```

---

## 🔍 Debug Commands

Test backend from command line:

```bash
# Health check
curl https://YOUR-BACKEND.onrender.com/health

# Test registration
curl -X POST "https://YOUR-BACKEND.onrender.com/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","role":"student","name":"Test User"}'
```

---

## 📞 Need More Help?

See detailed guide: **`VERCEL_RENDER_TROUBLESHOOTING.md`**

---

**This should fix 90% of deployment issues!** 🎉
