import React, { useState } from 'react';
import { Code, Calendar, ExternalLink, FileText, Plus, X, Edit2, Save } from 'lucide-react';
import { FormField } from './ui/Validation';

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    technologies: project?.technologies?.join(', ') || '',
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    status: project?.status || 'Planning',
    projectUrl: project?.projectUrl || '',
    pdfFile: null,
    pdfFileName: project?.pdfFileName || ''
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
      setFormData(prev => ({ ...prev, pdfFileName: file.name }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null
      };
      
      onSave(projectData);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
            <Code size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Showcase your technical projects</p>
          </div>
        </div>
        
        <button onClick={onCancel} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Project Name"
            type="text"
            placeholder="e.g. E-commerce Website"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />
          
          <FormField
            label="Project URL"
            type="url"
            placeholder="https://github.com/username/project"
            value={formData.projectUrl}
            onChange={(e) => handleChange('projectUrl', e.target.value)}
          />
        </div>

        <FormField
          label="Description"
          type="textarea"
          placeholder="Describe your project, its purpose, and your role..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          className="min-h-[100px]"
          required
        />

        <FormField
          label="Technologies Used"
          type="text"
          placeholder="React, Node.js, MongoDB, Express (comma-separated)"
          value={formData.technologies}
          onChange={(e) => handleChange('technologies', e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText size={20} />
            Project Documentation
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Upload PDF Document
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('pdfFile', e.target.files[0])}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.pdfFileName && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Selected: {formData.pdfFileName}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {project ? 'Update Project' : 'Add Project'}
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

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'In Progress': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Planning': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'On Hold': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 truncate">{project.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies?.map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-lg">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => onEdit(project)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={12} />
              {new Date(project.startDate).toLocaleDateString()}
              {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
            </div>
          </div>
          
          <div className="flex gap-2">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {project.pdfUrl && (
              <a
                href={project.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800"
              >
                <FileText size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProjectForm, ProjectCard };
