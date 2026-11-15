import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { loginSuccess } from '../redux/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Cursor-following ambient green aura state
  const [glowPos, setGlowPos] = useState({ x: -400, y: -400 });
  const [isOutsideForm, setIsOutsideForm] = useState(true);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    let animationFrameId;
    let targetX = -400;
    let targetY = -400;
    let currentX = -400;
    let currentY = -400;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        currentX = e.clientX;
        currentY = e.clientY;
        setHasMoved(true);
      }
    };

    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      setGlowPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasMoved]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ') || 'Alex Morgan',
      email: email || 'alex@nectar.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    dispatch(loginSuccess(user));
    navigate('/dashboard');
  };

  const handleFillDemo = () => {
    setEmail('alex@nectar.com');
    setPassword('mindful123');
  };

  return (
    <div className="min-h-screen bg-nectar-canvas dark:bg-nectar-darkBg flex items-center justify-center p-6 transition-colors relative overflow-hidden">
      {/* Floating Interactive Cursor-Tracking Green Aura */}
      <div
        className={`pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl will-change-transform z-0 ${
          hasMoved ? (isOutsideForm ? 'opacity-85 scale-100' : 'opacity-35 scale-110') : 'opacity-0'
        }`}
        style={{
          left: `${glowPos.x}px`,
          top: `${glowPos.y}px`,
          width: isOutsideForm ? '440px' : '520px',
          height: isOutsideForm ? '440px' : '520px',
          background: 'radial-gradient(circle, rgba(97, 188, 118, 0.50) 0%, rgba(209, 250, 223, 0.40) 35%, rgba(11, 116, 67, 0.18) 65%, transparent 85%)',
          transition: 'opacity 0.35s ease, transform 0.35s ease, width 0.4s ease, height 0.4s ease',
        }}
      />

      {/* Multi-layered organic drifting aura backdrops (matching front page) */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[340px] bg-gradient-to-tr from-nectar-mint/45 via-emerald-100/35 to-nectar-peach/25 rounded-full blur-3xl pointer-events-none animate-ambient-drift-1" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[280px] bg-gradient-to-br from-nectar-leaf/25 via-nectar-wasabi/40 to-nectar-peachLight/30 rounded-full blur-3xl pointer-events-none animate-ambient-drift-2" />

      <div 
        onMouseEnter={() => setIsOutsideForm(false)}
        onMouseLeave={() => setIsOutsideForm(true)}
        className="relative z-10 w-full max-w-md bg-white/90 dark:bg-nectar-darkCard/90 backdrop-blur-xl rounded-3xl border border-nectar-forest/15 dark:border-nectar-darkBorder shadow-nectar-float p-8 sm:p-10 transition-all duration-300"
      >
        
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-nectar-forest dark:hover:text-nectar-mint mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nectar-emerald to-nectar-forest flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Leaf className="w-6 h-6 text-nectar-mint" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-nectar-forest dark:text-nectar-mint">
            Sign In to Nectar
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Access your Smart Expense & Insights Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@nectar.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-nectar-darkBorder bg-gray-50 dark:bg-nectar-darkBg text-sm focus:outline-none focus:ring-2 focus:ring-nectar-emerald"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-nectar-darkBorder bg-gray-50 dark:bg-nectar-darkBg text-sm focus:outline-none focus:ring-2 focus:ring-nectar-emerald"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-nectar btn-nectar-primary btn-shine py-3 mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-nectar-wasabi dark:bg-nectar-forest/20 text-nectar-forest dark:text-nectar-mint text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-nectar-forest/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Demo Credentials</span>
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-nectar-forest dark:text-nectar-mint hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}