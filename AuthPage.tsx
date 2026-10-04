import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import { signInWithGoogle } from '../lib/googleAuth';
import { Shield, UserCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Account registered! You can now start practicing.');
        navigate('/setup');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/setup');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('demo@example.com');
    setPassword('password123');
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'password123'
      });
      if (error) {
        // If demo user doesn't exist yet, try signing up
        await supabase.auth.signUp({ email: 'demo@example.com', password: 'password123' });
      }
      navigate('/setup');
    } catch {
      navigate('/setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-14 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[#e4e4e7] rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center text-white font-mono text-sm font-semibold mx-auto mb-3 shadow-xs">
            <span className="text-blue-400">/</span>PA
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#18181b]">
            {isSignUp ? 'Create Student Account' : 'Sign In to Workstation'}
          </h1>
          <p className="text-xs text-[#52525b] mt-1">
            Track interview practice sessions, speech cadence, and placement readiness.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#71717a] font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full text-xs pl-9 pr-3 py-2 border border-[#e4e4e7] rounded bg-white text-[#18181b] focus:outline-none focus:border-[#18181b]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#71717a] font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2 border border-[#e4e4e7] rounded bg-white text-[#18181b] focus:outline-none focus:border-[#18181b]"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-colors disabled:opacity-50 shadow-xs"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="my-5 flex items-center justify-between text-xs text-[#a1a1aa]">
          <div className="border-t border-[#e4e4e7] flex-1" />
          <span className="px-3 font-mono text-[11px]">or continue with</span>
          <div className="border-t border-[#e4e4e7] flex-1" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => signInWithGoogle('Placement Workstation')}
            className="w-full py-2 px-3 text-xs font-medium border border-[#e4e4e7] rounded bg-white text-[#18181b] hover:bg-[#f4f4f5] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign In with Google</span>
          </button>

          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2 px-3 text-xs font-medium bg-[#fafafa] border border-[#e4e4e7] rounded text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors font-mono"
          >
            Use Demo Candidate (demo@example.com)
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#e4e4e7] text-center text-xs text-[#71717a]">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="font-semibold text-blue-600 hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
