# Ngrok Quick Reference Card

## 🚀 Quick Start Commands

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev -- --host
```

### Terminal 3 - Ngrok Backend
```bash
ngrok http 8000
```
**Copy the HTTPS URL!** (e.g., `https://abc123.ngrok.io`)

### Terminal 4 - Ngrok Frontend
```bash
ngrok http 5173
```
**Copy the HTTPS URL!** (e.g., `https://xyz789.ngrok.io`)

## 📝 Environment Files

### frontend/.env
```env
VITE_API_URL=https://YOUR-BACKEND-NGROK-URL.ngrok.io
VITE_WS_URL=wss://YOUR-BACKEND-NGROK-URL.ngrok.io
```

### backend/.env
```env
SECRET_KEY=focusmate-secret-key-change-in-production
DATABASE_URL=sqlite:///./focusmate.db
FRONTEND_URL=https://YOUR-FRONTEND-NGROK-URL.ngrok.io
```

## ✅ Testing Checklist

- [ ] All 4 terminals running
- [ ] Backend health check: `https://backend-url/health`
- [ ] Frontend loads: `https://frontend-url`
- [ ] Teacher registers on laptop
- [ ] Student registers on mobile
- [ ] Teacher creates session
- [ ] Student joins with code
- [ ] Video streams work
- [ ] Attention updates in real-time

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| Ngrok not found | Use full path: `C:\ngrok\ngrok.exe http 8000` |
| CORS error | Check `FRONTEND_URL` in backend/.env, restart backend |
| WebSocket failed | Use `wss://` in frontend/.env, restart frontend |
| Camera denied | Allow camera in browser settings |
| Port in use | Close other apps using ports 8000 or 5173 |

## 📱 Access URLs

**Both devices use the FRONTEND URL:**
- Laptop: `https://your-frontend.ngrok.io`
- Mobile: `https://your-frontend.ngrok.io`

## 🔄 Restart Process

1. Stop backend (Ctrl+C in Terminal 1)
2. Stop frontend (Ctrl+C in Terminal 2)
3. Keep ngrok running (Terminals 3 & 4)
4. Start backend again
5. Start frontend again

## 💾 Save Your URLs

```
Backend:  https://_________________.ngrok.io
Frontend: https://_________________.ngrok.io

Date: ___________
Time: ___________
```

## 📞 Help Resources

- Full Guide: `NGROK_SETUP_GUIDE.md`
- Visual Steps: `NGROK_VISUAL_STEPS.md`
- Deployment Options: `DEPLOYMENT_GUIDE.md`

---

**Print this page for quick reference!** 📄
