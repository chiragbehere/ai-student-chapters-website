import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <div className="w-full relative min-h-screen flex items-center justify-center z-10 px-4 transition-colors duration-300">
      <SEO title="Admin Login" description="Admin panel login for AI Student Chapters" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 sm:p-10 max-w-sm w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-black font-heading text-heading mb-2">
            Admin <span className="grad-text">Panel</span>
          </h1>
          <p className="text-foreground/40 text-sm">
            Sign in to manage your site content
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-coral/10 border border-coral/20 text-coral text-xs font-medium mb-5"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-foreground/30 uppercase mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm font-medium placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 focus:bg-foreground/8 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest text-foreground/30 uppercase mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm font-medium placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 focus:bg-foreground/8 transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="genz-btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-foreground/25 text-[10px] text-center mt-6">
          Create an admin account in Supabase Dashboard → Authentication
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
