import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield, Key, AlertCircle, CheckCircle } from 'lucide-react';

const AdminUnlockModal = ({ isOpen, onClose, onUnlock, loading, error }) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const lockoutEnd = localStorage.getItem('adminLockout');
    if (lockoutEnd) {
      const remainingTime = parseInt(lockoutEnd) - Date.now();
      if (remainingTime > 0) {
        setIsLocked(true);
        const timer = setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
          localStorage.removeItem('adminLockout');
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        localStorage.removeItem('adminLockout');
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (passcode.trim()) {
      onUnlock(passcode);
      setAttempts(prev => prev + 1);
      
      // Lock out after MAX_ATTEMPTS failed attempts
      if (attempts + 1 >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem('adminLockout', lockoutEnd.toString());
        setIsLocked(true);
      }
    }
  };

  const getRemainingTime = () => {
    const lockoutEnd = localStorage.getItem('adminLockout');
    if (lockoutEnd) {
      const remaining = Math.max(0, parseInt(lockoutEnd) - Date.now());
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return '0:00';
  };

  const getSecurityLevel = () => {
    if (attempts === 0) return { color: 'text-green-500', text: 'Secure' };
    if (attempts === 1) return { color: 'text-yellow-500', text: 'Warning' };
    if (attempts === 2) return { color: 'text-orange-500', text: 'Critical' };
    return { color: 'text-red-500', text: 'Locked' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">
            Admin Access Required
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
            Enter the administrator passcode to access the dashboard
          </p>
        </div>

        {/* Security Status */}
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Security Status:</span>
              <span className={`text-sm font-bold ${getSecurityLevel().color}`}>
                {getSecurityLevel().text}
              </span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Attempts: {attempts}/{MAX_ATTEMPTS}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {isLocked ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                <Lock size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                  Access Temporarily Locked
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Too many failed attempts. Please wait before trying again.
                </p>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-3">
                  <p className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                    {getRemainingTime()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Time Remaining
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Passcode Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock size={20} className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full pl-10 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-slate-400" />
                  ) : (
                    <Eye size={20} className="text-slate-400" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Security Tips */}
              {attempts > 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                    {MAX_ATTEMPTS - attempts} attempts remaining before lockout
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!passcode.trim() || loading}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Unlocking...
                    </>
                  ) : (
                    <>
                      <Shield size={20} />
                      Unlock Admin
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle size={12} />
            <span>Secure authentication with rate limiting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUnlockModal;
