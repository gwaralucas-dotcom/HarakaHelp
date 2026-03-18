import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { adminLogin, isAdminLoggedIn } from '../../utils/storage';
import { useEffect } from 'react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (adminLogin(password)) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password. Default: admin123');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-2">Emergency Response System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="mb-6">
            <label className="text-white font-medium block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 pr-12 text-white placeholder-slate-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        {/* Back to App */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-slate-400 text-sm hover:text-white"
        >
          ← Back to Emergency App
        </button>

        <p className="text-slate-500 text-xs text-center mt-6">
          Default password: admin123
        </p>
      </motion.div>
    </div>
  );
}
