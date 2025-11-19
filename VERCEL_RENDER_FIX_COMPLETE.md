# Vercel + Render Deployment Fix Guide

## 🔧 Common Issues & Solutions

### Issue: Registration/Login Failed

This usually happens due to:
1. **CORS errors** - Backend not allowing frontend domain
2. **Environment variables** - Missing or incorrect URLs
3. **Database not initialized** - Render needs database setup
4. **SECRET_KEY missing** - Backend can't create JWT tokens

## ✅ Step-by-Step Fix

### Step 1: Check Your URLs

You need to know:
- **Frontend URL**: `https://your-app.vercel.app`
- **Backend URL**: `https://your-backend.onrender.com`

### Step 2: Fix Backend Environment Variables (Render)

1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your backend service
3. Go to **"Environment"** tab
4. Add/Update these variables:

```
SECRET_KEY=focusmate-production-secret-key-change-this-to-something-random-and-long
DATABASE_URL=sqlite:///./focusmate.db
FRONTEND_URL=https://your-app.vercel.app
```

**IMPORTANT**: Replace `https://your-app.vercel.app` with YOUR actual Vercel URL!

4. Click **"Save Changes"**
5. Render will automatically redeploy

### Step 3: Fix Frontend Environment Variables (Vercel)

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add these variables:

```
VITE_API_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com
```

**IMPORTANT**: Replace `https://your-backend.onrender.com` with YOUR actual Render URL!

5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click the **"..."** menu on the latest deployment
8. Click **"Redeploy"**

### Step 4: Update CORS in Backend Code

The backend needs to allow your Vercel domain. I'll update the code for you.

### Step 5: Test the Fix

1. Open your Vercel URL in browser
2. Open browser console (Press F12)
3. Try to register
4. Check console for errors

## 🔍 How to Debug

### Check Backend Health

Open in browser: `https://your-backend.onrender.com/health`

Should see:
```json
{"status":"healthy"}
```

If you see an error, check Render logs.

### Check Frontend Console

1. Open your Vercel URL
2. Press F12 (Developer Tools)
3. Go to **Console** tab
4. Try to register
5. Look for errors

Common errors:

**"CORS policy"**
→ Backend FRONTEND_URL is wrong

**"Network Error"**
→ Backend URL is wrong or backend is down

**"401 Unauthorized"**
→ SECRET_KEY missing in backend

**"500 Internal Server Error"**
→ Check Render logs for backend errors

### Check Render Logs

1. Go to Render Dashboard
2. Click your backend service
3. Click **"Logs"** tab
4. Look for errors when you try to register

## 🚀 After I Update the Code

### What You Need to Do:

1. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Fix Vercel and Render deployment"
   git push origin main
   ```

2. **Vercel** (if connected to GitHub):
   - Automatically deploys when you push
   - Wait 1-2 minutes
   - Check deployment status in Vercel dashboard

3. **Render** (if connected to GitHub):
   - Automatically deploys when you push
   - Wait 2-5 minutes (Render is slower)
   - Check deployment status in Render dashboard

### If Auto-Deploy is NOT Set Up:

**For Vercel:**
1. Go to Vercel dashboard
2. Click your project
3. Go to "Deployments"
4. Click "Redeploy" on latest deployment

**For Render:**
1. Go to Render dashboard
2. Click your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

## 📋 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Backend environment variables set (SECRET_KEY, FRONTEND_URL)
- [ ] Frontend environment variables set (VITE_API_URL, VITE_WS_URL)
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Registration works
- [ ] Login works

## 💡 Pro Tips

### Vercel Auto-Deploy
- Connect your GitHub repo to Vercel
- Every push to main branch auto-deploys
- Takes 1-2 minutes

### Render Auto-Deploy
- Connect your GitHub repo to Render
- Every push to main branch auto-deploys
- Takes 2-5 minutes (slower than Vercel)

### Environment Variables
- After changing env vars, you MUST redeploy
- Vercel: Redeploy from dashboard
- Render: Automatically redeploys when you save env vars

## 🆘 Still Not Working?

### Check These:

1. **Backend URL correct?**
   - Should end with `.onrender.com`
   - Should start with `https://`
   - No trailing slash

2. **Frontend URL correct?**
   - Should end with `.vercel.app`
   - Should start with `https://`
   - No trailing slash

3. **Environment variables saved?**
   - Check Vercel settings
   - Check Render environment tab

4. **Redeployed after changes?**
   - Vercel: Check deployments tab
   - Render: Check events tab

### Get Detailed Error Info:

1. Open browser console (F12)
2. Go to **Network** tab
3. Try to register
4. Click on the failed request
5. Check **Response** tab for error message
6. Share the error message with me

## 📞 Common Error Messages

### "Failed to fetch"
**Cause**: Backend URL is wrong or backend is down
**Fix**: Check VITE_API_URL in Vercel, check Render logs

### "CORS policy: No 'Access-Control-Allow-Origin'"
**Cause**: Backend doesn't allow your Vercel domain
**Fix**: Check FRONTEND_URL in Render matches your Vercel URL exactly

### "401 Unauthorized"
**Cause**: SECRET_KEY missing or wrong
**Fix**: Add SECRET_KEY in Render environment variables

### "500 Internal Server Error"
**Cause**: Backend crashed
**Fix**: Check Render logs for Python errors

### "Email already registered"
**Cause**: You already registered with that email
**Fix**: Try a different email or use login instead

## 🎯 Quick Fix Summary

1. Set environment variables in Render (backend)
2. Set environment variables in Vercel (frontend)
3. I'll update the CORS code
4. You push to GitHub
5. Wait for auto-deploy (or manually redeploy)
6. Test registration/login

---

**Let me know your URLs and I'll help you fix this!**
