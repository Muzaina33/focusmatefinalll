#!/bin/bash

# FocusMate Deployment Pre-Check Script
# Run this before deploying to catch common issues

echo "🚀 FocusMate Deployment Pre-Check"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "✅ Project root directory confirmed"
echo ""

# Check backend files
echo "📦 Checking Backend..."
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Missing backend/requirements.txt"
    exit 1
fi

if [ ! -f "backend/app/main.py" ]; then
    echo "❌ Missing backend/app/main.py"
    exit 1
fi

echo "✅ Backend files present"
echo ""

# Check frontend files
echo "📦 Checking Frontend..."
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Missing frontend/package.json"
    exit 1
fi

if [ ! -f "frontend/vite.config.ts" ]; then
    echo "❌ Missing frontend/vite.config.ts"
    exit 1
fi

echo "✅ Frontend files present"
echo ""

# Check for .env files
echo "🔐 Checking Environment Configuration..."

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env exists"
    
    # Check for required variables
    if grep -q "SECRET_KEY" backend/.env; then
        echo "  ✅ SECRET_KEY configured"
    else
        echo "  ⚠️  WARNING: SECRET_KEY not found in backend/.env"
    fi
else
    echo "⚠️  WARNING: backend/.env not found (copy from .env.example)"
fi

if [ -f "frontend/.env" ]; then
    echo "✅ Frontend .env exists"
    
    # Check for required variables
    if grep -q "VITE_API_URL" frontend/.env; then
        echo "  ✅ VITE_API_URL configured"
    else
        echo "  ⚠️  WARNING: VITE_API_URL not found in frontend/.env"
    fi
    
    if grep -q "VITE_WS_URL" frontend/.env; then
        echo "  ✅ VITE_WS_URL configured"
    else
        echo "  ⚠️  WARNING: VITE_WS_URL not found in frontend/.env"
    fi
else
    echo "⚠️  WARNING: frontend/.env not found (copy from .env.example)"
fi

echo ""

# Check Git status
echo "📝 Checking Git Status..."
if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        UNCOMMITTED=$(git status --porcelain | wc -l)
        if [ $UNCOMMITTED -eq 0 ]; then
            echo "✅ All changes committed"
        else
            echo "⚠️  WARNING: You have $UNCOMMITTED uncommitted changes"
            echo "   Consider committing before deployment"
        fi
    else
        echo "⚠️  Not a git repository"
    fi
else
    echo "⚠️  Git not installed"
fi

echo ""

# Check dependencies
echo "📚 Checking Dependencies..."

if command -v python3 &> /dev/null; then
    echo "✅ Python3 installed: $(python3 --version)"
else
    echo "❌ Python3 not found"
fi

if command -v node &> /dev/null; then
    echo "✅ Node.js installed: $(node --version)"
else
    echo "❌ Node.js not found"
fi

if command -v npm &> /dev/null; then
    echo "✅ npm installed: $(npm --version)"
else
    echo "❌ npm not found"
fi

echo ""
echo "=================================="
echo "✅ Pre-check complete!"
echo ""
echo "Next steps:"
echo "1. Review any warnings above"
echo "2. Follow DEPLOYMENT_GUIDE.md for deployment instructions"
echo "3. Use DEPLOYMENT_CHECKLIST.md to track progress"
echo ""
