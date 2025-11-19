# Quick Fix Checklist - Vercel + Render

## 🚨 Registration/Login Not Working?

Follow this checklist:

### ✅ Step 1: Set Backend Environment Variables (Render)

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Click "Environment" tab
4. Add these (click "Add Environment Variable"):

```
SECRET_KEY = focusmate-production-secret-key-minimum-32-characters-long
DATABASE_URL = sqlite:///./focusmate.db
FRONTEND_URL = https://your-actual-app.vercel.app
```

**IMPORTANT**: Replace `your-actual-app` with YOUR Vercel URL!

5. Click "Save Changes"
6. Wait for Render to redeploy (~3-5 minutes)

### ✅ Step 2: Set Frontend Environment Variables (Vercel)

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Click "Settings" → "Environment Variables"
4. Add these:

```
VITE_API_URL = https://your-backend.onrender.com
VITE_WS_URL = wss://your-backend.onrender.com
```

**IMPORTANT**: Replace `your-backend` with YOUR Render URL!

5. Click "Save"
6. Go to "Deployments" tab
7. Click "..." on latest deployment → "Redeploy"
8. Wait for deployment (~1-2 minutes)

### ✅ Step 3: Push Updated Code

I've updated the backend code to fix CORS issues. Now you need to push:

```bash
git add .
git commit -m "Fix Vercel and Render deployment"
git push origin main
```

Wait for both to redeploy:
- Vercel: ~2 minutes
- Render: ~5 minutes

### ✅ Step 4: Test

1. Open your Vercel URL
2. Press F12 (open developer console)
3. Try to register
4. Check console for errors

## 🔍 Quick Tests

### Test 1: Backend Health Check

Open: `https://your-backend.onrender.com/health`

**Expected**:
```json
{"status":"healthy"}
```

**If you see error**: Backend is not running, check Render logs

### Test 2: Frontend Loads

Open: `https://your-app.vercel.app`

**Expected**: Landing page loads

**If you see error**: Check Vercel deployment logs

### Test 3: API Connection

1. Open your Vercel URL
2. Press F12
3. Go to Console tab
4. Type: `console.log(import.meta.env.VITE_API_URL)`
5. Press Enter

**Expected**: Should show your Render backend URL

**If shows undefined**: Environment variables not set correctly

## 🚨 Common Errors & Fixes

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Cause**: Backend doesn't allow your Vercel domain

**Fix**:
1. Check `FRONTEND_URL` in Render environment variables
2. Must match your Vercel URL EXACTLY
3. No trailing slash
4. Must start with `https://`

### Error: "Network Error" or "Failed to fetch"

**Cause**: Backend URL is wrong or backend is down

**Fix**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Test backend health: `https://your-backend.onrender.com/health`
3. Check Render logs for errors

### Error: "401 Unauthorized"

**Cause**: SECRET_KEY not set in backend

**Fix**:
1. Add `SECRET_KEY` in Render environment variables
2. Must be at least 32 characters
3. Save and wait for redeploy

### Error: "500 Internal Server Error"

**Cause**: Backend crashed

**Fix**:
1. Go to Render dashboard
2. Click "Logs" tab
3. Look for Python error messages
4. Share error with me

## 📋 Environment Variables Checklist

### Render (Backend):
- [ ] `SECRET_KEY` set (32+ characters)
- [ ] `DATABASE_URL` set (`sqlite:///./focusmate.db`)
- [ ] `FRONTEND_URL` set (your Vercel URL)
- [ ] Saved and redeployed

### Vercel (Frontend):
- [ ] `VITE_API_URL` set (your Render URL with https://)
- [ ] `VITE_WS_URL` set (your Render URL with wss://)
- [ ] Saved and redeployed

## 🎯 URLs Format Check

### ✅ Correct Format:

**Render Backend**:
```
https://focusmate-backend.onrender.com
```

**Vercel Frontend**:
```
https://focusmate.vercel.app
```

### ❌ Wrong Format:

```
http://focusmate-backend.onrender.com  ← Missing 's' in https
https://focusmate-backend.onrender.com/  ← Trailing slash
focusmate-backend.onrender.com  ← Missing https://
```

## 🔄 After Fixing

1. Push code changes (if I updated code)
2. Wait for deployments to finish
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try registration again
5. Check browser console for errors

## 📞 Still Not Working?

Share with me:

1. **Your URLs**:
   - Vercel frontend URL
   - Render backend URL

2. **Error message** from browser console (F12 → Console tab)

3. **Render logs** (if backend error)

I'll help you debug! 🚀
