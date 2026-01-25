import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, ChevronDown } from 'lucide-react';
import { FormField, SelectField, validateGrade, validateCredits, validateSubjectCode, validateSemesterNumber } from './ui/Validation';

const GRADE_POINTS = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
};

const GRADE_OPTIONS = Object.keys(GRADE_POINTS).map(grade => ({
  value: grade,
  label: `${grade} - ${GRADE_POINTS[grade]} points`
}));

const AcademicEntryForm = ({ student, semester, onSave, onCancel }) => {
  const [semNum, setSemNum] = useState(semester ? semester.num : '');
  const [subjects, setSubjects] = useState(semester ? semester.subjects : [
    { code: '', title: '', credits: 3, grade: 'O' }
  ]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const addSubject = () => {
    setSubjects([...subjects, { code: '', title: '', credits: 3, grade: 'O' }]);
  };

  const removeSubject = (idx) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== idx));
      // Clear errors for removed subject
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`subjects.${idx}.code`];
        delete newErrors[`subjects.${idx}.title`];
        delete newErrors[`subjects.${idx}.credits`];
        delete newErrors[`subjects.${idx}.grade`];
        return newErrors;
      });
    }
  };

  const updateSubject = (idx, field, val) => {
    const newSubs = [...subjects];
    newSubs[idx][field] = field === 'credits' ? parseFloat(val) || '' : val;
    setSubjects(newSubs);
    
    // Validate on change if field has been touched
    const fieldKey = `subjects.${idx}.${field}`;
    if (touched[fieldKey]) {
      validateField(fieldKey, val);
    }
  };

  const validateField = (fieldKey, value) => {
    const [field, index, subField] = fieldKey.split('.');
    const newErrors = { ...errors };
    
    if (field === 'semNum') {
      if (!value) {
        newErrors.semNum = 'Semester number is required';
      } else if (!validateSemesterNumber(value)) {
        newErrors.semNum = 'Semester must be between 1 and 8';
      } else {
        delete newErrors.semNum;
      }
    } else if (field === 'subjects') {
      const idx = parseInt(index);
      if (subField === 'code') {
        if (!value.trim()) {
          newErrors[fieldKey] = 'Subject code is required';
        } else if (!validateSubjectCode(value)) {
          newErrors[fieldKey] = 'Invalid subject code format (e.g., CS101)';
        } else {
          delete newErrors[fieldKey];
        }
      } else if (subField === 'title') {
        if (!value.trim()) {
          newErrors[fieldKey] = 'Subject title is required';
        } else if (value.trim().length < 3) {
          newErrors[fieldKey] = 'Title must be at least 3 characters';
        } else {
          delete newErrors[fieldKey];
        }
      } else if (subField === 'credits') {
        if (!value) {
          newErrors[fieldKey] = 'Credits are required';
        } else if (!validateCredits(value)) {
          newErrors[fieldKey] = 'Credits must be between 1 and 10';
        } else {
          delete newErrors[fieldKey];
        }
      } else if (subField === 'grade') {
        if (!validateGrade(value)) {
          newErrors[fieldKey] = 'Invalid grade';
        } else {
          delete newErrors[fieldKey];
        }
      }
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate semester number
    if (!semNum) {
      newErrors.semNum = 'Semester number is required';
    } else if (!validateSemesterNumber(semNum)) {
      newErrors.semNum = 'Semester must be between 1 and 8';
    }
    
    // Validate subjects
    subjects.forEach((subject, idx) => {
      if (!subject.code.trim()) {
        newErrors[`subjects.${idx}.code`] = 'Subject code is required';
      } else if (!validateSubjectCode(subject.code)) {
        newErrors[`subjects.${idx}.code`] = 'Invalid subject code format';
      }
      
      if (!subject.title.trim()) {
        newErrors[`subjects.${idx}.title`] = 'Subject title is required';
      } else if (subject.title.trim().length < 3) {
        newErrors[`subjects.${idx}.title`] = 'Title must be at least 3 characters';
      }
      
      if (!subject.credits) {
        newErrors[`subjects.${idx}.credits`] = 'Credits are required';
      } else if (!validateCredits(subject.credits)) {
        newErrors[`subjects.${idx}.credits`] = 'Credits must be between 1 and 10';
      }
      
      if (!validateGrade(subject.grade)) {
        newErrors[`subjects.${idx}.grade`] = 'Invalid grade';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldKey) => {
    setTouched(prev => ({ ...prev, [fieldKey]: true }));
    
    // Validate on blur
    if (fieldKey === 'semNum') {
      validateField(fieldKey, semNum);
    } else if (fieldKey.startsWith('subjects.')) {
      const [_, index, subField] = fieldKey.split('.');
      const idx = parseInt(index);
      validateField(fieldKey, subjects[idx][subField]);
    }
  };

  const handleSave = () => {
    // Mark all fields as touched
    const allTouched = { semNum: true };
    subjects.forEach((_, idx) => {
      allTouched[`subjects.${idx}.code`] = true;
      allTouched[`subjects.${idx}.title`] = true;
      allTouched[`subjects.${idx}.credits`] = true;
      allTouched[`subjects.${idx}.grade`] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      onSave(student.registerNumber, {
        num: parseInt(semNum),
        subjects: subjects.map(s => ({
          ...s,
          code: s.code.toUpperCase().trim(),
          title: s.title.trim(),
          credits: parseFloat(s.credits),
          grade: s.grade
        }))
      });
      onCancel();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {semester ? 'Edit Semester' : 'New Semester Entry'}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
            {semester ? 'Update semester details and grades' : 'Select grades to calculate SGPA'}
          </p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest">
          Sem {semNum || '--'}
        </div>
      </div>

      <div className="mb-8 max-w-md mx-auto">
        <FormField
          label="Target Semester"
          type="number"
          placeholder="e.g. 1"
          value={semNum}
          onChange={(e) => setSemNum(e.target.value)}
          onBlur={() => handleBlur('semNum')}
          error={errors.semNum}
          className="text-center text-xl font-bold w-full"
          min="1"
          max="8"
        />
      </div>

      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <div className="col-span-2">Code</div>
          <div className="col-span-5">Subject Name</div>
          <div className="col-span-2 text-center">Credits</div>
          <div className="col-span-2 text-center">Grade</div>
          <div className="col-span-1"></div>
        </div>

        {subjects.map((s, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 dark:bg-slate-700 p-6 rounded-3xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 transition-all items-center">
            <div className="col-span-1 md:col-span-2">
              <FormField
                type="text"
                placeholder="CS101"
                value={s.code}
                onChange={(e) => updateSubject(idx, 'code', e.target.value)}
                onBlur={() => handleBlur(`subjects.${idx}.code`)}
                error={errors[`subjects.${idx}.code`]}
                className="p-3 rounded-xl bg-white dark:bg-slate-600 border-none text-sm font-bold uppercase w-full"
                required
              />
            </div>
            
            <div className="col-span-1 md:col-span-5">
              <FormField
                type="text"
                placeholder="Data Structures"
                value={s.title}
                onChange={(e) => updateSubject(idx, 'title', e.target.value)}
                onBlur={() => handleBlur(`subjects.${idx}.title`)}
                error={errors[`subjects.${idx}.title`]}
                className="p-3 rounded-xl bg-white dark:bg-slate-600 border-none text-sm font-medium w-full"
                required
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <FormField
                type="number"
                placeholder="Cr"
                value={s.credits}
                onChange={(e) => updateSubject(idx, 'credits', e.target.value)}
                onBlur={() => handleBlur(`subjects.${idx}.credits`)}
                error={errors[`subjects.${idx}.credits`]}
                className="p-3 rounded-xl bg-white dark:bg-slate-600 border-none text-sm font-black text-center w-full"
                min="1"
                max="10"
                step="0.5"
                required
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <SelectField
                value={s.grade}
                onChange={(e) => updateSubject(idx, 'grade', e.target.value)}
                onBlur={() => handleBlur(`subjects.${idx}.grade`)}
                error={errors[`subjects.${idx}.grade`]}
                options={GRADE_OPTIONS}
                className="p-3 rounded-xl bg-white dark:bg-slate-600 border-none text-sm font-black text-center w-full"
                required
              />
            </div>
            
            <div className="col-span-1 flex items-center justify-center">
              {subjects.length > 1 && (
                <button 
                  onClick={() => removeSubject(idx)} 
                  className="text-slate-300 dark:text-slate-500 hover:text-red-500 transition-colors p-2"
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button 
          onClick={addSubject}
          className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-3xl text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
          type="button"
        >
          <Plus size={16} /> Add Subject Row
        </button>
      </div>

      <div className="mt-12 flex gap-4">
        <button 
          onClick={handleSave}
          className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          type="button"
        >
          <CheckCircle2 size={24} /> {semester ? 'Update Semester' : 'Finalize Semester'}
        </button>
        <button 
          onClick={onCancel}
          className="px-8 py-5 rounded-3xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AcademicEntryForm;
