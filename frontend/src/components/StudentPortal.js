import React, { useState } from 'react';
import { User, LogOut, Plus, History, BookOpen, Settings, Download, TrendingUp, Code, Award, GraduationCap } from 'lucide-react';
import AcademicEntryForm from './AcademicEntryForm';
import StudentProfile from './StudentProfile';
import ThemeToggle from './ui/ThemeToggle';
import GPATrends from './GPATrends';
import ExportOptions from './ExportOptions';
import { SkeletonSemesterCard, SkeletonAcademicForm } from './ui/Skeleton';
import { ProjectForm, ProjectCard } from './ProjectManager';
import { ExtraCourseForm, ExtraCourseCard, AchievementForm, AchievementCard } from './CourseAchievementManager';
import { api } from '../services/api';

const StudentPortal = ({ activeStudent, setActiveStudent, setView, saveSemesterData, onProfileUpdate, loading }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('records');
  const [addingProject, setAddingProject] = useState(false);
  const [addingCourse, setAddingCourse] = useState(false);
  const [addingAchievement, setAddingAchievement] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);

  const handleExport = (format, content, filename) => {
    if (format === 'excel') {
      // Create CSV download
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Create and download HTML as PDF (simplified version)
      const blob = new Blob([content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      await api.addProject(activeStudent.registerNumber, projectData);
      // Refresh student data to get updated projects
      const updatedStudent = await api.getStudent(activeStudent.registerNumber);
      setActiveStudent(updatedStudent);
      setAddingProject(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      await api.addCourse(activeStudent.registerNumber, courseData);
      // Refresh student data to get updated courses
      const updatedStudent = await api.getStudent(activeStudent.registerNumber);
      setActiveStudent(updatedStudent);
      setAddingCourse(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const handleSaveAchievement = async (achievementData) => {
    try {
      await api.addAchievement(activeStudent.registerNumber, achievementData);
      // Refresh student data to get updated achievements
      const updatedStudent = await api.getStudent(activeStudent.registerNumber);
      setActiveStudent(updatedStudent);
      setAddingAchievement(false);
      setEditingAchievement(null);
    } catch (error) {
      console.error('Failed to save achievement:', error);
    }
  };

  const handleEditSemester = (semester) => {
    setEditingSemester(semester);
    setIsAdding(true);
  };

  const handleUpdateSemester = async (semesterData) => {
    try {
      await api.updateSemester(editingSemester._id, semesterData);
      // Refresh student data to get updated semesters
      const updatedStudent = await api.getStudent(activeStudent.registerNumber);
      setActiveStudent(updatedStudent);
      setEditingSemester(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to update semester:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSemester(null);
    setIsAdding(false);
  };

  if (!activeStudent) return null;

  if (showProfile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-6 sticky top-0 z-30 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProfile(false)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <LogOut size={20} />
            </button>
            <div>
              <h1 className="font-black text-slate-800 dark:text-white text-xl tracking-tight">Profile Settings</h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Manage your information</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main className="max-w-5xl mx-auto p-6">
          <StudentProfile 
            student={activeStudent} 
            onUpdate={onProfileUpdate}
            onClose={() => setShowProfile(false)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-6 sticky top-0 z-30 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <User size={24} />
          </div>
          <div>
            <h1 className="font-black text-slate-800 dark:text-white text-xl tracking-tight">{activeStudent.name}</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">ID: {activeStudent.registerNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProfile(true)}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-600"
          >
            <Settings size={20} />
          </button>
          <ThemeToggle />
          <button onClick={() => setView('landing')} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-red-500 transition-all border border-slate-200 dark:border-slate-600">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Cumulative GPA</p>
            <h2 className="text-7xl font-black">{activeStudent.cgpa.toFixed(2)}</h2>
            <div className="flex gap-4 mt-6">
              <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md">
                {activeStudent.semesters?.length || 0} Semesters Logged
              </div>
              {activeStudent.department && (
                <div className="bg-indigo-500/20 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md">
                  {activeStudent.department}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="relative z-10 bg-indigo-500 hover:bg-indigo-400 text-white p-8 rounded-[2.5rem] font-black flex flex-col items-center gap-2 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            <Plus size={32} strokeWidth={3} />
            <span className="text-xs uppercase tracking-widest">Add Semester</span>
          </button>
        </div>

        {isAdding ? (
          loading ? <SkeletonAcademicForm /> : (
            <AcademicEntryForm 
              student={activeStudent} 
              semester={editingSemester}
              onSave={editingSemester ? handleUpdateSemester : saveSemesterData} 
              onCancel={handleCancelEdit} 
            />
          )
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                onClick={() => setActiveTab('records')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all min-w-[100px] ${
                  activeTab === 'records'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <History size={18} />
                <span className="text-sm">Records</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all min-w-[100px] ${
                  activeTab === 'projects'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code size={18} />
                <span className="text-sm">Projects</span>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all min-w-[100px] ${
                  activeTab === 'courses'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <GraduationCap size={18} />
                <span className="text-sm">Courses</span>
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all min-w-[100px] ${
                  activeTab === 'achievements'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Award size={18} />
                <span className="text-sm">Awards</span>
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all min-w-[100px] ${
                  activeTab === 'trends'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <TrendingUp size={18} />
                <span className="text-sm">Trends</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'records' && (
              <div className="space-y-6">
                {!activeStudent.semesters || activeStudent.semesters.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-600 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
                      <BookOpen size={32} />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 font-bold">No academic data found. Start by adding your first semester.</p>
                  </div>
                ) : loading ? (
                  <SkeletonSemesterCard />
                ) : (
                  <div className="grid gap-6">
                    {activeStudent.semesters.map(sem => (
                      <div key={sem.num} className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-black text-xl shadow-sm border border-slate-100 dark:border-slate-600">
                              {sem.num}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 dark:text-white">Semester {sem.num}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{sem.totalCredits} Credits Total</p>
                              {activeStudent.department && (
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-widest mt-1">
                                  {activeStudent.department}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{sem.sgpa.toFixed(2)}</p>
                              <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">SGPA</p>
                            </div>
                            <button
                              onClick={() => handleEditSemester(sem)}
                              className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                              title="Edit Semester"
                            >
                              <Settings size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sem.subjects.map((sub, idx) => (
                            <div key={idx} className="bg-slate-50/30 dark:bg-slate-700/30 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-600/50 flex justify-between items-center">
                              <div className="overflow-hidden">
                                <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">{sub.code}</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{sub.title}</p>
                              </div>
                              <div className="text-right ml-4 shrink-0">
                                <p className="text-sm font-black text-slate-800 dark:text-white">{sub.grade}</p>
                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{sub.credits} Cr</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                {addingProject ? (
                  <ProjectForm 
                    project={editingProject}
                    onSave={handleSaveProject} 
                    onCancel={() => {
                      setAddingProject(false);
                      setEditingProject(null);
                    }} 
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">My Projects</h3>
                      <button
                        onClick={() => setAddingProject(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                      >
                        <Plus size={16} />
                        Add Project
                      </button>
                    </div>
                    
                    {!activeStudent.projects || activeStudent.projects.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-600 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
                          <Code size={32} />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold">No projects yet. Start by adding your first project.</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {activeStudent.projects.map((project, idx) => (
                          <ProjectCard 
                            key={idx}
                            project={project} 
                            onEdit={(project) => {
                              setEditingProject(project);
                              setAddingProject(true);
                            }}
                            onDelete={() => {/* TODO: Implement delete */}}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                {addingCourse ? (
                  <ExtraCourseForm 
                    course={editingCourse}
                    onSave={handleSaveCourse} 
                    onCancel={() => {
                      setAddingCourse(false);
                      setEditingCourse(null);
                    }} 
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">Extra Courses</h3>
                      <button
                        onClick={() => setAddingCourse(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                      >
                        <Plus size={16} />
                        Add Course
                      </button>
                    </div>
                    
                    {!activeStudent.extraCourses || activeStudent.extraCourses.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-600 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
                          <GraduationCap size={32} />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold">No extra courses yet. Add your certifications and online courses.</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {activeStudent.extraCourses.map((course, idx) => (
                          <ExtraCourseCard 
                            key={idx}
                            course={course} 
                            onEdit={(course) => {
                              setEditingCourse(course);
                              setAddingCourse(true);
                            }}
                            onDelete={() => {/* TODO: Implement delete */}}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                {addingAchievement ? (
                  <AchievementForm 
                    achievement={editingAchievement}
                    onSave={handleSaveAchievement} 
                    onCancel={() => {
                      setAddingAchievement(false);
                      setEditingAchievement(null);
                    }} 
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">Achievements & Awards</h3>
                      <button
                        onClick={() => setAddingAchievement(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700"
                      >
                        <Plus size={16} />
                        Add Achievement
                      </button>
                    </div>
                    
                    {!activeStudent.achievements || activeStudent.achievements.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-600 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
                          <Award size={32} />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold">No achievements yet. Celebrate your accomplishments!</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {activeStudent.achievements.map((achievement, idx) => (
                          <AchievementCard 
                            key={idx}
                            achievement={achievement} 
                            onEdit={(achievement) => {
                              setEditingAchievement(achievement);
                              setAddingAchievement(true);
                            }}
                            onDelete={() => {/* TODO: Implement delete */}}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'trends' && (
              <GPATrends semesters={activeStudent.semesters} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentPortal;
