import React, { useState } from 'react';
import { User, Mail, Phone, Building, Calendar, Edit2, Save, X } from 'lucide-react';
import { FormField, validateEmail, validateSrisakthiEmail } from './ui/Validation';

const StudentDetailsForm = ({ student, onUpdate, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name || '',
    registerNumber: student.registerNumber || '',
    email: student.email || '',
    phone: student.phone || '',
    department: student.department || '',
    year: student.year || '',
    currentSemester: student.currentSemester || 1
  });
  const [errors, setErrors] = useState({});

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: student.name || '',
      registerNumber: student.registerNumber || '',
      email: student.email || '',
      phone: student.phone || '',
      department: student.department || '',
      year: student.year || '',
      currentSemester: student.currentSemester || 1
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Student Details</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Personal and academic information</p>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-2xl font-medium hover:bg-slate-700 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <User size={14} />
            Full Name
          </label>
          {isEditing ? (
            <FormField
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Enter your full name"
            />
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white">
              {student.name || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <User size={14} />
            Register Number
          </label>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white uppercase">
            {student.registerNumber || 'Not provided'}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Mail size={14} />
            Email Address
          </label>
          {isEditing ? (
            <FormField
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
            />
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white">
              {student.email || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Phone size={14} />
            Phone Number
          </label>
          {isEditing ? (
            <FormField
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white">
              {student.phone || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Building size={14} />
            Department
          </label>
          {isEditing ? (
            <div className="space-y-2">
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-xs font-medium">{errors.department}</p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white">
              {student.department || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={14} />
            Academic Year
          </label>
          {isEditing ? (
            <div className="space-y-2">
              <select
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.year && (
                <p className="text-red-500 text-xs font-medium">{errors.year}</p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white">
              {student.year || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Current Semester
          </label>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white">
            Semester {student.currentSemester || 1}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Current CGPA
          </label>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl font-medium text-slate-800 dark:text-white">
            {student.cgpa?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
        <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
          <strong>Note:</strong> Register number cannot be changed. Contact administrator for any corrections.
        </p>
      </div>
    </div>
  );
};

export default StudentDetailsForm;
