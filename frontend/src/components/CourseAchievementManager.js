import React, { useState } from 'react';
import { BookOpen, Award, Calendar, ExternalLink, FileText, Plus, X, Edit2, Save } from 'lucide-react';
import { FormField } from './ui/Validation';

const ExtraCourseForm = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: course?.name || '',
    provider: course?.provider || '',
    description: course?.description || '',
    startDate: course?.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
    endDate: course?.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
    skills: course?.skills?.join(', ') || '',
    certificateFile: null,
    certificateFileName: course?.certificateFileName || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (file) {
      setFormData(prev => ({ ...prev, certificateFileName: file.name }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }
    
    if (!formData.provider.trim()) {
      newErrors.provider = 'Provider is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const courseData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null
      };
      
      onSave(courseData);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              {course ? 'Edit Course' : 'Add New Course'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Document your extra learning achievements</p>
          </div>
        </div>
        
        <button onClick={onCancel} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Course Name"
            type="text"
            placeholder="e.g. Machine Learning Fundamentals"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />
          
          <FormField
            label="Provider/Platform"
            type="text"
            placeholder="e.g. Coursera, Udemy, edX"
            value={formData.provider}
            onChange={(e) => handleChange('provider', e.target.value)}
            error={errors.provider}
            required
          />
        </div>

        <FormField
          label="Description"
          type="textarea"
          placeholder="What you learned and key takeaways..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="min-h-[100px]"
        />

        <FormField
          label="Skills Gained"
          type="text"
          placeholder="Python, TensorFlow, Data Analysis (comma-separated)"
          value={formData.skills}
          onChange={(e) => handleChange('skills', e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            error={errors.startDate}
            required
          />
          
          <FormField
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            min={formData.startDate}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen size={20} />
            Course Certificate
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Upload Certificate PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('certificateFile', e.target.files[0])}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {formData.certificateFileName && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Selected: {formData.certificateFileName}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {course ? 'Update Course' : 'Add Course'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const ExtraCourseCard = ({ course, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate">{course.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{course.provider}</p>
            {course.description && (
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">{course.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {course.skills?.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-medium rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => onEdit(course)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(course._id)}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={12} />
            {new Date(course.startDate).toLocaleDateString()}
            {course.endDate && ` - ${new Date(course.endDate).toLocaleDateString()}`}
          </div>
          
          {course.certificateUrl && (
            <a
              href={course.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800"
            >
              <FileText size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const AchievementForm = ({ achievement, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: achievement?.title || '',
    description: achievement?.description || '',
    type: achievement?.type || 'Academic',
    level: achievement?.level || 'College',
    date: achievement?.date ? new Date(achievement.date).toISOString().split('T')[0] : '',
    certificateUrl: achievement?.certificateUrl || '',
    certificateFileName: achievement?.certificateFileName || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const achievementData = {
        ...formData,
        date: new Date(formData.date)
      };
      
      onSave(achievementData);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              {achievement ? 'Edit Achievement' : 'Add New Achievement'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Celebrate your accomplishments</p>
          </div>
        </div>
        
        <button onClick={onCancel} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Achievement Title"
          type="text"
          placeholder="e.g. First Prize in Hackathon"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <FormField
          label="Description"
          type="textarea"
          placeholder="Describe your achievement and its significance..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          className="min-h-[100px]"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="Academic">Academic</option>
              <option value="Technical">Technical</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Competition">Competition</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="College">College</option>
              <option value="University">University</option>
              <option value="State">State</option>
              <option value="National">National</option>
              <option value="International">International</option>
            </select>
          </div>

          <FormField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            error={errors.date}
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText size={20} />
            Certificate
          </h3>
          
          <FormField
            label="Certificate File Name"
            type="text"
            placeholder="achievement-certificate.pdf"
            value={formData.certificateFileName}
            onChange={(e) => handleChange('certificateFileName', e.target.value)}
          />
          
          <FormField
            label="Certificate URL"
            type="url"
            placeholder="https://example.com/certificate.pdf"
            value={formData.certificateUrl}
            onChange={(e) => handleChange('certificateUrl', e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-yellow-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-yellow-700 shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {achievement ? 'Update Achievement' : 'Add Achievement'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const AchievementCard = ({ achievement, onEdit, onDelete }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'Academic': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Technical': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'Sports': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'Cultural': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'Competition': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'International': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'National': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'State': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'University': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 truncate">{achievement.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">{achievement.description}</p>
            <div className="flex gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(achievement.type)}`}>
                {achievement.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(achievement.level)}`}>
                {achievement.level}
              </span>
            </div>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => onEdit(achievement)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(achievement._id)}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={12} />
            {new Date(achievement.date).toLocaleDateString()}
          </div>
          
          {achievement.certificateUrl && (
            <a
              href={achievement.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800"
            >
              <FileText size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export { ExtraCourseForm, ExtraCourseCard, AchievementForm, AchievementCard };
