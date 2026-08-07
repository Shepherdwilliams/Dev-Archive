import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, X, AlertCircle, Loader2, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  syncUserProfile,
  UserProfile
} from '../src/firebase';
import { User } from 'firebase/auth';
import { sciFiAudio } from './SoundEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  userProfile: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userProfile
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sciFiAudio.playClick();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile(res.user);
        sciFiAudio.playSuccess();
        setSuccessMsg('Account created successfully!');
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(res.user);
        sciFiAudio.playSuccess();
        setSuccessMsg('Signed in successfully!');
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Auth error:', err);
      let cleanMessage = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        cleanMessage = 'Invalid email or password. Please verify and retry.';
      } else if (err.code === 'auth/email-already-in-use') {
        cleanMessage = 'An account with this email already exists. Try logging in instead.';
      } else if (err.code === 'auth/weak-password') {
        cleanMessage = 'Password should be at least 6 characters.';
      }
      setError(cleanMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    sciFiAudio.playClick();
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(res.user);
      sciFiAudio.playSuccess();
      setSuccessMsg('Signed in with Google!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    sciFiAudio.playClick();
    await firebaseSignOut(auth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10020] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-[#0d121d] border border-brand-border/90 rounded-3xl p-6 sm:p-8 shadow-2xl font-mono text-white space-y-6 overflow-hidden"
      >
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-green" />
            <h3 className="text-lg font-black tracking-tight text-white uppercase">
              {currentUser ? 'User Account Profile' : mode === 'signin' ? 'Sign In to Archive' : 'Create Researcher Account'}
            </h3>
          </div>
          <button
            onClick={() => {
              sciFiAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Logged In View */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center text-brand-green text-2xl font-bold shadow-lg shadow-brand-green/20">
              {userProfile?.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="space-y-1">
              <strong className="text-white text-base block font-bold">
                {userProfile?.displayName || 'Researcher User'}
              </strong>
              <span className="text-xs text-brand-light-gray">{currentUser.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-gray-dark border border-brand-border text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-brand-light-gray">User ID:</span>
                <span className="font-mono text-[10px] text-brand-green truncate max-w-[180px]">{currentUser.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-light-gray">Cloud Sync:</span>
                <span className="text-emerald-400 font-bold">Active (Firestore)</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Google OAuth Quick Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-gray-dark hover:bg-white/10 border border-brand-border text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.8-.5-1.7-.5-2.6z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 text-[10px] text-brand-light-gray uppercase">
              <div className="flex-1 h-px bg-brand-border/60" />
              <span>Or Email Credentials</span>
              <div className="flex-1 h-px bg-brand-border/60" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-brand-light-gray font-bold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-light-gray absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@example.com"
                    className="w-full bg-brand-gray-dark border border-brand-border focus:border-brand-green text-xs rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-brand-light-gray font-bold mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-light-gray absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-brand-gray-dark border border-brand-border focus:border-brand-green text-xs rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-brand-green hover:bg-brand-green-light text-brand-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === 'signin' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-brand-light-gray border-t border-brand-border/40">
              {mode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      sciFiAudio.playClick();
                      setMode('signup');
                      setError(null);
                    }}
                    className="text-brand-green font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign Up Now
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => {
                      sciFiAudio.playClick();
                      setMode('signin');
                      setError(null);
                    }}
                    className="text-brand-green font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
