import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react';

const StudentProfile = ({ student, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email || '',
    phone: student.phone || '',
    dateOfBirth: student.dateOfBirth || '',
    address: student.address || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await onUpdate(student.registerNumber, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: student.name,
      email: student.email || '',
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth || '',
      address: student.address || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-3xl flex items-center justify-center">
            <User size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Student Profile</h2>
            <p className="text-slate-500 dark:text-slate-400">ID: {student.registerNumber}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
            >
              <Edit2 size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-2 rounded-xl bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
              >
                <Save size={18} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 rounded-xl bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
            />
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium">
              {student.name}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Mail size={12} /> Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
            />
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium">
              {student.email || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Phone size={12} /> Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
            />
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium">
              {student.phone || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={12} /> Date of Birth
          </label>
          {isEditing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
            />
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium">
              {student.dateOfBirth || 'Not provided'}
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Address</label>
          {isEditing ? (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white resize-none"
            />
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium">
              {student.address || 'Not provided'}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{student.cgpa.toFixed(2)}</p>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Current CGPA</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{student.semesters?.length || 0}</p>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Semesters</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {student.semesters?.reduce((acc, sem) => acc + (sem.totalCredits || 0), 0) || 0}
            </p>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Credits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
