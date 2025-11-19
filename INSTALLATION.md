# FocusMate Installation Guide

Complete step-by-step installation instructions for FocusMate platform.

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Browser**: Chrome 90+ or Edge 90+
- **Camera**: Webcam required for students
- **Internet**: Stable broadband connection

### Software Requirements
- Node.js 18.0 or higher
- Python 3.10 or higher
- pip (Python package manager)
- npm (Node package manager)
- Git

## Step 1: Install Prerequisites

### Windows

#### Install Python
1. Download Python 3.10+ from https://www.python.org/downloads/
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Click "Install Now"
5. Verify: Open CMD and run `python --version`

#### Install Node.js
1. Download Node.js 18+ from https://nodejs.org/
2. Run installer with default settings
3. Verify: Open CMD and run `node --version` and `npm --version`

#### Install Git
1. Download Git from https://git-scm.com/download/win
2. Run installer with default settings
3. Verify: Open CMD and run `git --version`

### macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.10

# Install Node.js
brew install node@18

# Install Git
brew install git

# Verify installations
python3 --version
node --version
npm --version
git --version
```

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Python
sudo apt install python3.10 python3.10-venv python3-pip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install git

# Verify installations
python3 --version
node --version
npm --version
git --version
```

## Step 2: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/focusmate.git

# Navigate to project directory
cd focusmate
```

## Step 3: Backend Setup

### Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
```

### Install Dependencies

```bash
# Install Python packages
pip install -r requirements.txt

# Verify installation
pip list
```

### Initialize Database

```bash
# Run database initialization
python -m app.init_db

# You should see: "Database tables created successfully!"
```

### Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file and set your JWT secret
# Windows: notepad .env
# macOS/Linux: nano .env

# Change JWT_SECRET to a secure random string
```

### Start Backend Server

```bash
# Make sure virtual environment is activated
uvicorn app.main:socket_app --reload

# Server should start on http://localhost:8000
# You should see: "Database initialized" and "WebSocket server ready"
```

Keep this terminal open and running.

## Step 4: Frontend Setup

Open a **new terminal window**.

```bash
# Navigate to frontend directory
cd focusmate/frontend

# Install dependencies
npm install

# This may take a few minutes
```

### Start Frontend Development Server

```bash
# Start Vite dev server
npm run dev

# Server should start on http://localhost:5173
```

Keep this terminal open and running.

## Step 5: AI Engine Setup (Optional)

The AI Engine is optional for initial testing. You can set it up later.

Open a **new terminal window**.

```bash
# Navigate to AI directory
cd focusmate/backend/app/ai

# Install AI dependencies
pip install -r requirements.txt

# This will install OpenCV and Mediapipe (may take a few minutes)
```

### Start AI Engine

```bash
# Start AI Engine
python ai_engine.py

# You should see: "FocusMate AI Engine starting..."
```

Keep this terminal open if you want AI monitoring active.

## Step 6: Browser Extension Setup

### Install Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"** button
5. Navigate to `focusmate/extension` folder
6. Click **"Select Folder"**
7. Extension should appear in your extensions list
8. Pin the extension to toolbar (optional)

### Verify Extension

1. Click the FocusMate extension icon
2. You should see the popup with "LockMode: OFF"
3. Extension is ready!

## Step 7: Verify Installation

### Test Backend

1. Open browser: http://localhost:8000
2. You should see: `{"message": "FocusMate API", "status": "running"}`
3. Visit API docs: http://localhost:8000/docs
4. You should see Swagger UI with all endpoints

### Test Frontend

1. Open browser: http://localhost:5173
2. You should see the FocusMate landing page
3. Dark theme with neon cyan colors
4. "Login" and "Get Started" buttons visible

### Test Complete Flow

1. Click **"Get Started"** on landing page
2. Register as a **Teacher**:
   - Name: Test Teacher
   - Email: teacher@test.com
   - Password: password123
   - Role: Teacher
3. Click **"Create Account"**
4. You should be redirected to Teacher Dashboard
5. Click **"Create Session"**
6. You should see a 6-character room code

7. Open a **new incognito window**
8. Go to http://localhost:5173
9. Register as a **Student**:
   - Name: Test Student
   - Email: student@test.com
   - Password: password123
   - Role: Student
10. Enter the room code from teacher
11. Click **"Join Class"**
12. Allow camera/microphone access
13. You should see the student classroom

## Troubleshooting

### Backend Won't Start

**Error: "Address already in use"**
```bash
# Kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

**Error: "Module not found"**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Won't Start

**Error: "EADDRINUSE: address already in use"**
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

**Error: "Cannot find module"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### AI Engine Issues

**Error: "No module named 'cv2'"**
```bash
# Reinstall OpenCV
pip uninstall opencv-python
pip install opencv-python
```

**Error: "No module named 'mediapipe'"**
```bash
# Install Mediapipe
pip install mediapipe
```

### Camera Not Working

1. Check browser permissions
2. Go to `chrome://settings/content/camera`
3. Allow http://localhost:5173
4. Refresh the page

### Extension Not Loading

1. Check manifest.json is valid
2. Reload extension in `chrome://extensions/`
3. Check console for errors (click "Errors" button)

## Next Steps

1. ✅ All services running
2. ✅ Can register and login
3. ✅ Teacher can create sessions
4. ✅ Students can join sessions
5. ✅ Extension installed

You're ready to use FocusMate! 🎉

## Production Deployment

For production deployment, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Getting Help

- 📖 Read the [README.md](README.md)
- 🐛 Report issues on GitHub
- 💬 Join our Discord community
- 📧 Email: support@focusmate.com
