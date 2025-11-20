# 🐘 PostgreSQL Setup - Copy & Paste Commands

## 🎯 Quick Setup (3 commands)

### 1. Create PostgreSQL Database on Render

Go to: https://dashboard.render.com → "New +" → "PostgreSQL"

**Settings**:
- Name: `focusmate-db`
- Database: `focusmate_db`  
- User: `focusmate_user`
- Region: **Same as your backend**

Click "Create Database" → Wait 2 minutes → Copy "External Database URL"

### 2. Update Backend Environment Variable

Go to your backend service → Environment tab → Edit `DATABASE_URL`:

```
DATABASE_URL=postgres://focusmate_user:PASSWORD@HOST/focusmate_db
```

Replace with your actual PostgreSQL URL from step 1.

### 3. Deploy Updated Code

```bash
git add .
git commit -m "Switch to PostgreSQL for persistent storage"
git push origin main
```

## ✅ Done!

Your database will now persist through server restarts. No more re-registration needed!

## 🔍 Verify Success

Check Render logs for:
```
🔧 Database: PostgreSQL
Creating database tables...
Database tables created successfully!
```

Then test login with existing account - should work permanently now.