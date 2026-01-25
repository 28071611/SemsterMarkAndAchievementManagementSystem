import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const validateRegisterNumber = (regNo) => {
  const regex = /^[A-Za-z0-9]{6,20}$/;
  return regex.test(regNo);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateSrisakthiEmail = (email) => {
  const regex = /^[^\s@]+@srishakthi\.ac\.in$/;
  return regex.test(email);
};

export const validateGrade = (grade) => {
  const validGrades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
  return validGrades.includes(grade);
};

export const validateCredits = (credits) => {
  const num = parseFloat(credits);
  return !isNaN(num) && num > 0 && num <= 10;
};

export const validateSubjectCode = (code) => {
  const regex = /^[A-Za-z]{2,4}\d{3,4}$/;
  return regex.test(code);
};

export const validateSemesterNumber = (semNum) => {
  const num = parseInt(semNum);
  return !isNaN(num) && num > 0 && num <= 8;
};

const ValidationMessage = ({ type, message }) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'text-red-500 text-xs font-medium flex items-center gap-1';
      case 'success':
        return 'text-green-500 text-xs font-medium flex items-center gap-1';
      default:
        return 'text-slate-500 text-xs font-medium flex items-center gap-1';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={12} />;
      case 'success':
        return <CheckCircle size={12} />;
      default:
        return null;
    }
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      {message}
    </div>
  );
};

export const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error, 
  success, 
  validationMessage,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const getInputStyles = () => {
    const baseStyles = 'w-full p-3 rounded-xl border outline-none transition-all font-medium';
    const errorStyles = error ? 'border-red-500 bg-red-50' : '';
    const successStyles = success ? 'border-green-500 bg-green-50' : '';
    const focusStyles = 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
    const disabledStyles = disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white';
    
    return `${baseStyles} ${errorStyles} ${successStyles} ${focusStyles} ${disabledStyles} ${className}`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={getInputStyles()}
        {...props}
      />
      {validationMessage && (
        <ValidationMessage type={error ? 'error' : success ? 'success' : 'info'} message={validationMessage} />
      )}
    </div>
  );
};

export const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder, 
  error, 
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const getSelectStyles = () => {
    const baseStyles = 'w-full p-3 rounded-xl border outline-none transition-all font-medium appearance-none cursor-pointer';
    const errorStyles = error ? 'border-red-500 bg-red-50' : '';
    const focusStyles = 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
    const disabledStyles = disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white';
    
    return `${baseStyles} ${errorStyles} ${focusStyles} ${disabledStyles} ${className}`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={getSelectStyles()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && (
        <ValidationMessage type="error" message={error} />
      )}
    </div>
  );
};

export default ValidationMessage;
