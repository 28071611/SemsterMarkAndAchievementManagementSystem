import React, { useState, useMemo } from 'react';
import { LogOut, Search, Users, TrendingUp, BookOpen, Award } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

const AdminView = ({ students, setView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const avgCGPA = totalStudents > 0 
      ? students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / totalStudents 
      : 0;
    const totalSemesters = students.reduce((sum, s) => sum + (s.semesters?.length || 0), 0);
    const highPerformers = students.filter(s => (s.cgpa || 0) >= 8).length;

    return {
      totalStudents,
      avgCGPA,
      totalSemesters,
      highPerformers
    };
  }, [students]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply performance filter
    if (filterBy === 'high') {
      filtered = filtered.filter(s => (s.cgpa || 0) >= 8);
    } else if (filterBy === 'medium') {
      filtered = filtered.filter(s => (s.cgpa || 0) >= 6 && (s.cgpa || 0) < 8);
    } else if (filterBy === 'low') {
      filtered = filtered.filter(s => (s.cgpa || 0) < 6);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cgpa':
          return (b.cgpa || 0) - (a.cgpa || 0);
        case 'semesters':
          return (b.semesters?.length || 0) - (a.semesters?.length || 0);
        case 'registerNumber':
          return a.registerNumber.localeCompare(b.registerNumber);
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, sortBy, filterBy]);

  const getPerformanceColor = (cgpa) => {
    if (cgpa >= 8) return 'text-green-600 dark:text-green-400';
    if (cgpa >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceBadge = (cgpa) => {
    if (cgpa >= 8) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (cgpa >= 6) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-6 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Administrator Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and monitor student performance</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setView('landing')} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-red-500 transition-all border border-slate-200 dark:border-slate-600">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center">
                <Users size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalStudents}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Total Students</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.avgCGPA.toFixed(2)}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Average CGPA</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalSemesters}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Total Semesters</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-2xl flex items-center justify-center">
                <Award size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.highPerformers}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">High Performers</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or register number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="cgpa">Sort by CGPA</option>
              <option value="semesters">Sort by Semesters</option>
              <option value="registerNumber">Sort by Register Number</option>
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Students</option>
              <option value="high">High Performers (8+ CGPA)</option>
              <option value="medium">Average (6-8 CGPA)</option>
              <option value="low">Below Average (&lt;6 CGPA)</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Student Records</h2>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {searchTerm || filterBy !== 'all' ? 'No students found matching your criteria' : 'No students available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredStudents.map((student) => (
                <div key={student._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{student.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPerformanceBadge(student.cgpa || 0)}`}>
                          {student.cgpa?.toFixed(2) || '0.00'} CGPA
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                        Register Number: {student.registerNumber}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-700 dark:text-slate-300">{student.semesters?.length || 0}</strong> semesters
                        </span>
                        <span className={`font-medium ${getPerformanceColor(student.cgpa || 0)}`}>
                          {student.cgpa >= 8 ? 'Excellent' : student.cgpa >= 6 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getPerformanceColor(student.cgpa || 0)}`}>
                        {student.cgpa?.toFixed(2) || '0.00'}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">CGPA</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminView;
