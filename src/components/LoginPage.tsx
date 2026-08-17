import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

const REQUIRED_EMAIL = 'usdtrewardsnexus4312urey@gmail.com';
const REQUIRED_PASSWORD = 'usdtrewardsnexus4312urey@gmail.com';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against demo security layer
    setTimeout(() => {
      if (trimmedEmail === REQUIRED_EMAIL && trimmedPass === REQUIRED_PASSWORD) {
        setIsLoading(false);
        onLoginSuccess(trimmedEmail);
      } else {
        setIsLoading(false);
        setError('Invalid email or password.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 bg-[#07090e] relative overflow-hidden">
      {/* Subtle glow / grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 mb-4 border border-blue-400/30">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl flex items-center justify-center gap-2">
            Flash USDT Sender
          </h1>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            PRANK MODE
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/70">
            <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Operator Login</span>
            </div>
            <span className="text-[11px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              PRANK
            </span>
          </div>

          {error && (
            <div
              id="login-error-alert"
              className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Authentication Failed</p>
                <p className="mt-0.5 text-red-300/90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
            {/* Email Input */}
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                Operator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@flash-sender.demo"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#141b2b] border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="login-password-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                Password Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#141b2b] border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0f141f] transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Node Access...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
};
