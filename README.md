# FocusMate - AI Virtual Classroom Platform

<div align="center">

🎓 **A full-stack real-time virtual classroom platform with AI-based attention monitoring**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)

</div>

---

## ✨ Features

- 🎥 **Real-time Video Classrooms** - WebRTC-powered peer-to-peer video communication
- 🤖 **AI Attention Monitoring** - Mediapipe FaceMesh + OpenCV for engagement tracking
- 🔒 **LockMode System** - Browser extension prevents tab switching during class
- 📊 **Comprehensive Analytics** - Detailed attention reports and session analytics
- 🎨 **Premium Dark UI** - Neon cyan theme with glassmorphism effects
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Real-time Updates** - WebSocket-based instant communication
- 📈 **Status Tracking** - Engaged, Present, Looking Away, Drowsy, Absent, Left Class

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  FastAPI Backend │────▶│  SQLite Database│
│  (Vite + TS)    │◀────│  (WebSocket)     │◀────│                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │   AI Engine      │
         │              │  (Mediapipe +    │
         │              │   OpenCV)        │
         │              └──────────────────┘
         │
         ▼
┌─────────────────┐
│ Browser Extension│
│  (Manifest V3)   │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **Chrome Browser** (for extension)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/focusmate.git
cd focusmate
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:socket_app --reload
```

Backend runs on **http://localhost:8000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

### 4. AI Engine Setup (Optional for Testing)

```bash
cd backend/app/ai
pip install -r requirements.txt
python ai_engine.py
```

AI Engine runs on **http://localhost:8001**

### 5. Browser Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (top right)
3. Click **"Load unpacked"**
4. Select the `extension` folder from the project

## 📖 Usage Guide

### For Teachers

1. **Register** as a teacher at http://localhost:5173/register
2. **Login** and navigate to Teacher Dashboard
3. **Create Session** - Get a unique 6-character room code
4. **Share Code** with students
5. **Monitor Students** - View real-time attention scores and status
6. **Toggle LockMode** - Prevent students from switching tabs
7. **End Session** - Generate comprehensive reports

### For Students

1. **Register** as a student at http://localhost:5173/register
2. **Login** and navigate to Student Classroom
3. **Enter Room Code** provided by teacher
4. **Join Class** - Your camera will activate
5. **Monitor Yourself** - See your attention score in real-time
6. **Stay Focused** - AI tracks your engagement level

## 🎯 AI Attention Monitoring

The AI Engine analyzes:

- **Eye Aspect Ratio (EAR)** - Detects drowsiness
- **Head Pose** - Identifies looking away
- **Blink Rate** - Measures engagement
- **Face Presence** - Tracks absence

### Status Classifications

| Status | Description | Trigger |
|--------|-------------|---------|
| 🟢 **Engaged** | High attention, facing forward | Score > 70%, good posture |
| 🔵 **Present** | Face detected, neutral | Default state |
| 🟡 **Looking Away** | Head turned significantly | Head angle > 30° |
| 🟠 **Drowsy** | Low eye opening, slow blinks | EAR < 0.15 |
| 🔴 **Absent** | No face detected | > 2 seconds |
| ⛔ **Left Class** | Extended absence | > 10 seconds |

## 🔒 LockMode System

The browser extension enforces focus by:

1. **Detecting Tab Switches** - Monitors when students navigate away
2. **Blocking Navigation** - Prevents tab switching when enabled
3. **Auto-Refocusing** - Returns focus to classroom tab
4. **Logging Events** - Records all tab switch attempts

## 📊 Reporting Features

### Teacher Reports
- Session-wise analytics
- Individual student performance
- Attention timelines
- Status transition history
- Tab switch counts
- Export to CSV/PDF

### Student Reports
- Personal attention scores
- Session history
- Status timeline
- Self-improvement insights
- Export to PDF

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Socket.io-client** - WebSocket
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **python-socketio** - WebSocket
- **python-jose** - JWT
- **passlib** - Password hashing

### AI Engine
- **Mediapipe** - Face mesh detection
- **OpenCV** - Video processing
- **NumPy** - Numerical computations

### Browser Extension
- **Manifest V3** - Chrome extension
- **Vanilla JavaScript**

## 📁 Project Structure

```
focusmate/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # WebSocket, WebRTC
│   │   └── store/           # Zustand stores
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── ai/              # AI Engine
│   │   │   ├── face_detector.py
│   │   │   ├── attention_analyzer.py
│   │   │   └── ai_engine.py
│   │   ├── routers/         # API routes
│   │   ├── models.py        # Database models
│   │   ├── auth.py          # Authentication
│   │   ├── websocket.py     # WebSocket handlers
│   │   └── main.py          # App entry point
│   └── requirements.txt
├── extension/                # Browser extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── popup.html
├── docker-compose.yml
└── README.md
```

## 🌐 Public Deployment

### Deploy to Railway (Recommended)

For testing across devices (laptop + mobile), deploy to Railway:

1. **Quick Start**: Follow `QUICK_START_DEPLOYMENT.md`
2. **Detailed Guide**: See `DEPLOYMENT_GUIDE.md`
3. **Checklist**: Use `DEPLOYMENT_CHECKLIST.md`

**Deployment time**: ~15 minutes
**Cost**: Free tier available

### Alternative: Ngrok (Quick Testing)

For immediate testing without deployment:

```bash
# Install ngrok from https://ngrok.com/download
ngrok http 8000  # Backend
ngrok http 5173  # Frontend
```

See `QUICK_START_DEPLOYMENT.md` for detailed instructions.

## 🐳 Docker Deployment (Local)

```bash
docker-compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- AI Engine: http://localhost:8001

## 🔧 Configuration

### Environment Variables

Create `.env` file in `backend/`:

```env
DATABASE_URL=sqlite:///./focusmate.db
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## 📚 API Documentation

Once the backend is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

```
POST   /auth/register          # Register new user
POST   /auth/login             # Login user
GET    /auth/me                # Get current user
POST   /room/create            # Create session (teacher)
POST   /room/join              # Join session (student)
DELETE /room/{id}              # End session
GET    /reports/teacher/{id}/sessions
GET    /reports/student/{id}/sessions
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**FocusMate Team**

## 🙏 Acknowledgments

- Mediapipe for face detection
- FastAPI for the excellent web framework
- React team for the amazing library
- Tailwind CSS for beautiful styling

## 📞 Support

For support, email support@focusmate.com or open an issue on GitHub.

---

<div align="center">

**Made with ❤️ by the FocusMate Team**

⭐ Star us on GitHub if you find this project useful!

</div>
