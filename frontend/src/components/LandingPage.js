import React, { useEffect } from 'react';
import { GraduationCap, User, UserPlus } from 'lucide-react';

const LandingPage = ({ setView, showAdminLock, setShowAdminLock, adminUsername, setAdminUsername, adminPassword, setAdminPassword, passError, setPassError, onAdminUnlock }) => {
  // Secret admin access: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminLock(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setShowAdminLock]);

  return (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
    {showAdminLock && (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95">
          <h3 className="text-xl font-black mb-6">Admin Login</h3>
          <input 
            type="text" 
            className={`w-full p-4 rounded-2xl border-2 mb-4 outline-none ${passError ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-blue-500'}`}
            placeholder="Username"
            value={adminUsername}
            onChange={e => {
              setAdminUsername(e.target.value);
              if (passError) setPassError(false);
            }}
          />
          <input 
            type="password" 
            className={`w-full p-4 rounded-2xl border-2 mb-4 outline-none ${passError ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-blue-500'}`}
            placeholder="Password"
            value={adminPassword}
            onChange={e => {
              setAdminPassword(e.target.value);
              if (passError) setPassError(false);
            }}
          />
          {passError && (
            <p className="text-red-500 text-sm mb-4">Invalid username or password</p>
          )}
          <div className="flex gap-3">
            <button 
              onClick={onAdminUnlock}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black"
            >
              Login
            </button>
            <button onClick={() => setShowAdminLock(false)} className="px-6 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
          </div>
        </div>
      </div>
    )}

    <div className="max-w-4xl w-full text-center space-y-12">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-100">
          <GraduationCap size={40} color="white" />
        </div>
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">EduTrack</h1>
        <p className="text-slate-500 text-lg font-medium">Student Performance Management System</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
        <button 
          onClick={() => setView('student-login')}
          className="group p-10 bg-slate-50 hover:bg-indigo-600 rounded-[3.5rem] transition-all duration-500 text-left relative overflow-hidden shadow-sm"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform duration-500">
            <User size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 group-hover:text-white transition-colors">Student Login</h3>
          <p className="text-slate-500 mt-2 text-sm group-hover:text-indigo-50 transition-colors">Access your existing account.</p>
        </button>

        <button 
          onClick={() => setView('student-signup')}
          className="group p-10 bg-slate-50 hover:bg-green-600 rounded-[3.5rem] transition-all duration-500 text-left relative overflow-hidden shadow-sm"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 mb-8 group-hover:scale-110 transition-transform duration-500">
            <UserPlus size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 group-hover:text-white transition-colors">New Student</h3>
          <p className="text-slate-500 mt-2 text-sm group-hover:text-green-50 transition-colors">Create your academic profile.</p>
        </button>
      </div>
    </div>
  </div>
  );
};

export default LandingPage;
