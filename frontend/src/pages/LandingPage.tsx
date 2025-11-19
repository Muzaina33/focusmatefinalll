import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-neon-cyan mb-4 animate-pulse">
            FocusMate
          </h1>
          <div className="text-4xl md:text-6xl mb-2">🎓</div>
        </div>

        {/* Hero Section */}
        <div className="glass rounded-2xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI-Powered Virtual Classroom
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Real-time attention monitoring • LockMode focus enforcement • Comprehensive analytics
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-lg p-6">
              <div className="text-3xl mb-2">🎥</div>
              <h3 className="text-xl font-bold text-neon-cyan mb-2">Live Video</h3>
              <p className="text-gray-400">WebRTC-powered real-time classrooms</p>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="text-xl font-bold text-neon-cyan mb-2">AI Monitoring</h3>
              <p className="text-gray-400">Track student attention in real-time</p>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-xl font-bold text-neon-cyan mb-2">LockMode</h3>
              <p className="text-gray-400">Prevent tab switching during class</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-neon-cyan text-dark-bg font-bold rounded-lg hover:shadow-neon transition-all duration-300 text-lg"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 glass text-neon-cyan font-bold rounded-lg neon-hover transition-all duration-300 text-lg"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-sm">
          Premium dark UI • Fully responsive • Mobile-friendly
        </p>
      </div>
    </div>
  );
}
