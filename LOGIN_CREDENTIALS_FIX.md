# 🔑 "INVALID LOGIN CREDENTIALS" - PERMANENT FIX

## 🚨 Why This Keeps Happening

Every time you deploy code changes, users get "invalid login credentials" because:

1. **JWT Secret Key Issues** - Secret key changes invalidate all tokens
2. **Database Resets** - SQLite gets wiped on Render restarts  
3. **Token Expiration** - Tokens expire after 24 hours
4. **CORS/Environment Issues** - Backend can't validate tokens properly

## ✅ PERMANENT SOLUTION

### Step 1: Fix SECRET_KEY (Most Important!)

Go to Render Dashboard → Your Backend Service → Environment:

**CRITICAL**: Set a PERMANENT secret key that NEVER changes:

```
SECRET_KEY=focusmate-production-secret-key-2024-permanent-do-not-change-this-key-ever
```

**IMPORTANT**: 
- Must be at least 32 characters
- NEVER change this key once set
- Copy this EXACT key: `focusmate-production-secret-key-2024-permanent-do-not-change-this-key-ever`

### Step 2: Switch to PostgreSQL (Permanent Database)

**Current Problem**: SQLite gets wiped every restart

**Solution**: Use the PostgreSQL setup I created earlier:

1. **Create PostgreSQL Database** on Render (free)
2. **Update DATABASE_URL** environment variable
3. **User accounts persist forever**

Follow: `DATABASE_PERSISTENCE_FIX.md`

### Step 3: Extend Token Expiration

Update your backend config to make tokens last longer:

```python
# In backend/app/config.py
ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days instead of 24 hours
```

## 🚀 IMMEDIATE FIX (Right Now)

### Option 1: Set Permanent SECRET_KEY
1. Go to Render → Backend → Environment
2. Set: `SECRET_KEY=focusmate-production-secret-key-2024-permanent-do-not-change-this-key-ever`
3. Save → Wait for redeploy (3-5 minutes)
4. **Register fresh accounts** (old tokens are invalid)

### Option 2: Quick Re-registration
Since database likely reset, just register new accounts:

**Teacher Account:**
- Email: `teacher@test.com`
- Password: `teacher123`
- Role: Teacher

**Student Account:**
- Email: `student@test.com`  
- Password: `student123`
- Role: Student

## 🔧 Technical Explanation

### JWT Token Validation Process:
```
1. User logs in → Backend creates JWT with SECRET_KEY
2. Frontend stores JWT in localStorage
3. Every API call → Frontend sends JWT in Authorization header
4. Backend validates JWT using SAME SECRET_KEY
5. If SECRET_KEY changed → Validation fails → "Invalid credentials"
```

### Why It Happens on Deploy:
```
Old Deploy: SECRET_KEY = "abc123"
New Deploy: SECRET_KEY = "xyz789" (or undefined)
Result: All old tokens invalid → Users must re-login
```

## 📋 Prevention Checklist

- [ ] **SECRET_KEY set permanently** (never changes)
- [ ] **PostgreSQL database** (data persists)
- [ ] **Longer token expiration** (7 days)
- [ ] **Environment variables consistent** across deploys

## 🎯 Expected Behavior After Fix

1. **Deploy code changes** → Users stay logged in
2. **Server restarts** → Users stay logged in  
3. **Database persists** → No re-registration needed
4. **Tokens last 7 days** → Less frequent re-logins

## 🚨 Emergency Quick Fix

If users are locked out RIGHT NOW:

1. **Clear browser storage**: F12 → Application → Local Storage → Clear All
2. **Register new accounts** with same credentials
3. **Set permanent SECRET_KEY** in Render environment
4. **Switch to PostgreSQL** for permanent fix

---

**This will PERMANENTLY solve the "invalid login credentials" issue!** 🚀