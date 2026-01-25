import React, { useState } from 'react';
import { UserPlus, CheckCircle2, ArrowLeft } from 'lucide-react';
import { FormField, validateRegisterNumber, validateEmail, validateSrisakthiEmail } from './ui/Validation';

const StudentSignup = ({ onSignup, onBackToLogin, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    semester: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.registerNumber.trim()) {
      newErrors.registerNumber = 'Register number is required';
    } else if (!validateRegisterNumber(formData.registerNumber)) {
      newErrors.registerNumber = 'Invalid register number format';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (!validateSrisakthiEmail(formData.email)) {
      newErrors.email = 'Email must end with @srishakthi.ac.in';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      // Validate on change if field has been touched
      const newErrors = { ...errors };
      
      switch (field) {
        case 'name':
          if (!value.trim()) {
            newErrors.name = 'Name is required';
          } else if (value.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
          } else {
            delete newErrors.name;
          }
          break;
        case 'registerNumber':
          if (!value.trim()) {
            newErrors.registerNumber = 'Register number is required';
          } else if (!validateRegisterNumber(value)) {
            newErrors.registerNumber = 'Invalid register number format';
          } else {
            delete newErrors.registerNumber;
          }
          break;
        case 'email':
          if (!value.trim()) {
            newErrors.email = 'Email is required';
          } else if (!validateEmail(value)) {
            newErrors.email = 'Invalid email format';
          } else {
            delete newErrors.email;
          }
          break;
        default:
          if (value) {
            delete newErrors[field];
          }
      }
      
      setErrors(newErrors);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    handleChange(field, formData[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      onSignup(formData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white dark:ring-slate-800">
            <UserPlus size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Student Registration</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium">Create your academic profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Smith"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              disabled={loading}
              required
            />
            
            <FormField
              label="Register Number"
              type="text"
              placeholder="e.g. REG202401"
              value={formData.registerNumber}
              onChange={(e) => handleChange('registerNumber', e.target.value)}
              onBlur={() => handleBlur('registerNumber')}
              error={errors.registerNumber}
              disabled={loading}
              required
              className="uppercase"
            />
          </div>

          <FormField
            label="Email Address"
            type="email"
            placeholder="e.g. alex.smith@college.edu"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            disabled={loading}
            required
          />

          <FormField
            label="Phone Number"
            type="tel"
            placeholder="e.g. +91 9876543210"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={loading}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                  {errors.department}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                onBlur={() => handleBlur('year')}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.year && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                  {errors.year}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Current Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                onBlur={() => handleBlur('semester')}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              {errors.semester && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                  {errors.semester}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button 
              type="button"
              onClick={onBackToLogin}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              disabled={loading}
            >
              <ArrowLeft size={20} />
              Back to Login
            </button>
            
            <button 
              type="submit" 
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <CheckCircle2 size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            <strong>Note:</strong> By creating an account, you agree to maintain accurate academic records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
