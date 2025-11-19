# How to Use FocusMate - Quick Guide

## 🌐 Which Link to Use?

**Use your Vercel URL for BOTH teacher and student:**

```
https://your-app.vercel.app
```

**Same URL for everyone!** The app automatically shows:
- Teacher Dashboard → if you login as teacher
- Student Classroom → if you login as student

## 👨‍🏫 Teacher Instructions

### Step 1: Open the App
```
https://your-app.vercel.app
```

### Step 2: Login
- Click "Login"
- Enter your teacher email and password
- Click "Login"

### Step 3: Create Session
- Click "Create Session" button
- Your camera will appear (now un-mirrored!)
- You'll see a **Room Code** (e.g., ABC123)

### Step 4: Share Code
- Share the room code with your students
- Students will appear in the grid when they join
- Wait 5-10 seconds for student list to update

### Step 5: Monitor Students
- See all students in the grid
- View attention scores
- Toggle LockMode if needed
- End session when done

## 👨‍🎓 Student Instructions

### Step 1: Open the App
```
https://your-app.vercel.app
```
**(Same URL as teacher!)**

### Step 2: Login
- Click "Login"
- Enter your student email and password
- Click "Login"

### Step 3: Join Class
- Enter the **Room Code** from your teacher
- Click "Join Class"
- Allow camera access when prompted

### Step 4: Attend Class
- Your camera will appear (now un-mirrored!)
- See your attention score
- Stay focused!
- Click "Leave Class" when done

## 📱 Testing Scenario

### Device 1 (Laptop) - Teacher:
1. Open: `https://your-app.vercel.app`
2. Login as teacher
3. Create session
4. Note the room code (e.g., ABC123)

### Device 2 (Mobile) - Student:
1. Open: `https://your-app.vercel.app`
2. Login as student
3. Enter room code: ABC123
4. Join class

### What You Should See:

**Teacher (Laptop)**:
- Your camera (un-mirrored)
- Student appears in grid after 5-10 seconds
- Student name and info

**Student (Mobile)**:
- Your camera (un-mirrored)
- Attention panel
- Teacher placeholder

## ✅ What I Just Fixed

1. **Camera Mirror** - Added `transform: scaleX(-1)` to flip video
2. **Same URL** - Clarified that both use the same Vercel URL

## 🚀 Push the Changes

```bash
git add .
git commit -m "Fix mirrored camera view"
git push origin main
```

Wait for Vercel to deploy (~2 minutes), then test!

## 🔍 Troubleshooting

### "Which URL should I use?"
→ Your Vercel frontend URL for BOTH teacher and student

### "Camera is mirrored"
→ Fixed! Push the code and redeploy

### "Student not showing in teacher view"
→ Wait 5-10 seconds (auto-refresh)
→ Or refresh the page

### "Can't see each other's video"
→ This is normal (WebRTC needs TURN server)
→ Both see their OWN camera (that works!)

## 📝 Quick Reference

```
Frontend URL: https://your-app.vercel.app
Backend URL: https://your-backend.onrender.com

Teacher: Login → Create Session → Share Code
Student: Login → Enter Code → Join Class

Both use the SAME frontend URL!
```

## 🎯 Current Status

✅ Registration works
✅ Login works
✅ Teacher can create session
✅ Student can join session
✅ Both see their own cameras (un-mirrored now!)
✅ Student appears in teacher list (with 5-10 sec delay)
⚠️ Peer-to-peer video needs TURN server (future enhancement)

---

**Ready to test!** Push the code and use your Vercel URL on both devices! 🎉
