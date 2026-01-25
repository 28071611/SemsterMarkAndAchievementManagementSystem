import React, { useState } from 'react';
import { Fingerprint, CheckCircle2 } from 'lucide-react';
import { FormField, validateRegisterNumber } from './ui/Validation';

const StudentLogin = ({ onLogin, loading }) => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!regNo.trim()) {
      newErrors.regNo = 'Register number is required';
    } else if (!validateRegisterNumber(regNo)) {
      newErrors.regNo = 'Invalid register number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccess = (e) => {
    e.preventDefault();
    
    setTouched({ name: true, regNo: true });
    
    if (validateForm()) {
      onLogin(regNo.toUpperCase().trim(), name.trim());
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    if (touched.name) {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, name: 'Name is required' }));
      } else if (value.trim().length < 2) {
        setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      } else {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    }
  };

  const handleRegNoChange = (e) => {
    const value = e.target.value;
    setRegNo(value);
    
    if (touched.regNo) {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, regNo: 'Register number is required' }));
      } else if (!validateRegisterNumber(value)) {
        setErrors(prev => ({ ...prev, regNo: 'Invalid register number format' }));
      } else {
        setErrors(prev => ({ ...prev, regNo: '' }));
      }
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3.5rem] shadow-2xl p-10 md:p-12 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white dark:ring-slate-800">
            <Fingerprint size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Student Access</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium">Log in with Grade-based reporting</p>
        </div>

        <form onSubmit={handleAccess} className="space-y-6">
          <FormField
            label="Full Name"
            type="text"
            placeholder="e.g. Alex Smith"
            value={name}
            onChange={handleNameChange}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            disabled={loading}
            required
            className="uppercase"
          />
          
          <FormField
            label="Register Number"
            type="text"
            placeholder="e.g. REG202401"
            value={regNo}
            onChange={handleRegNoChange}
            onBlur={() => handleBlur('regNo')}
            error={errors.regNo}
            disabled={loading}
            required
            className="uppercase"
          />
          
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Accessing...
              </>
            ) : (
              <>
                Access My Portal <CheckCircle2 size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            <strong>Note:</strong> Enter your college register number and full name to access your academic portal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
