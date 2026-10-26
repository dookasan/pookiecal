import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppUser, googleSignIn, registerWithEmail, signInWithEmail } from '../utils/googleAuth';
import { ClayLogoMark } from './ClayIllustrations';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'register';
  onClose: () => void;
  onSuccess: (user: AppUser, isNewRegistration?: boolean, startEmpty?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'register',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [startEmpty, setStartEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your name to create your circle.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        const user = await registerWithEmail(name, email, password);
        onSuccess(user, true, startEmpty);
        onClose();
      } else {
        const user = await signInWithEmail(email, password);
        onSuccess(user, false, false);
        onClose();
      }
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      const code = authErr?.code || '';
      if (code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Switch to "Sign In" above.');
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg('Incorrect email or password. Please try again.');
      } else if (code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else {
        setErrorMsg(authErr?.message || 'Could not complete request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        onSuccess(res.user, mode === 'register', startEmpty);
        onClose();
      }
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      const code = authErr?.code || '';
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'pookiecal.com';

      if (code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google sign-in window was closed. You can also register directly with your email below.');
      } else if (code === 'auth/unauthorized-domain') {
        setErrorMsg(
          `Google Sign-In requires "${hostname}" in Firebase Authorized Domains. You can register immediately with Email & Password below!`
        );
      } else {
        setErrorMsg(
          'Google Sign-In could not complete right now. Register or sign in instantly with your Email & Password below!'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-md bg-[#fffaf0] border border-[#e5e5e5] rounded-[24px] p-6 sm:p-8 text-[#0a0a0a] my-auto shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f5f0e0] text-[#0a0a0a] flex items-center justify-center hover:bg-[#e5e0d0] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <ClayLogoMark />
          <span className="text-[19px] font-medium tracking-[-0.5px]">PookieCal</span>
        </div>

        <h2 id="auth-modal-title" className="clay-display-sm text-[28px] text-[#0a0a0a]">
          {mode === 'register' ? 'Create your free account' : 'Welcome back'}
        </h2>
        <p className="text-[14px] text-[#4a4a4a] mt-1">
          {mode === 'register'
            ? 'Start tracking birthdays, festival visits, and gift pools with your circle.'
            : 'Sign in to access your personal birthday wall and planned events.'}
        </p>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f5f0e0] rounded-[14px] mt-5">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`h-[38px] rounded-[10px] text-[13px] font-semibold transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-[#0a0a0a] text-[#ffffff]'
                : 'text-[#4a4a4a] hover:text-[#0a0a0a]'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`h-[38px] rounded-[10px] text-[13px] font-semibold transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#0a0a0a] text-[#ffffff]'
                : 'text-[#4a4a4a] hover:text-[#0a0a0a]'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-[12px] bg-[#fff0f3] border border-[#ff4d8b]/30 flex items-start gap-2.5 text-[13px] text-[#0a0a0a]">
            <AlertCircle className="w-4 h-4 text-[#ff4d8b] shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="mt-5 space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="w-full h-[44px] pl-10 pr-4 text-[14px] bg-[#ffffff] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-[44px] pl-10 pr-4 text-[14px] bg-[#ffffff] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-[#3a3a3a] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-[44px] pl-10 pr-4 text-[14px] bg-[#ffffff] text-[#0a0a0a] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <label className="flex items-start gap-2.5 p-3 rounded-[12px] bg-[#faf5e8] border border-[#e5e5e5] cursor-pointer">
              <input
                type="checkbox"
                checked={startEmpty}
                onChange={(e) => setStartEmpty(e.target.checked)}
                className="mt-0.5 accent-[#0a0a0a] w-4 h-4 rounded"
              />
              <span className="text-[12px] text-[#3a3a3a] leading-snug">
                <strong className="text-[#0a0a0a] font-semibold">Start with an empty calendar</strong>{' '}
                (uncheck to keep sample birthdays & festivals to explore first)
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[46px] bg-[#0a0a0a] text-[#ffffff] text-[14px] font-semibold rounded-[12px] hover:bg-[#222] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>Please wait...</span>
            ) : mode === 'register' ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Free Account</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="border-t border-[#e5e5e5] w-full"></div>
          <span className="bg-[#fffaf0] px-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#6a6a6a]">
            OR
          </span>
          <div className="border-t border-[#e5e5e5] w-full"></div>
        </div>

        {/* Google 1-Click Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="w-full h-[44px] bg-[#ffffff] text-[#0a0a0a] border border-[#d5d5d5] hover:bg-[#f5f0e0] text-[14px] font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-4 text-center text-[11px] text-[#6a6a6a]">
          By continuing, you agree to PookieCal's{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-[#0a0a0a] font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#0a0a0a] font-medium">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};
