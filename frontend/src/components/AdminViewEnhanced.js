import React, { useState, useMemo, useEffect } from 'react';
import { LogOut, Search, Users, TrendingUp, BookOpen, Award, Download, Filter, ChevronDown, Eye, Edit, Trash2, Mail, Calendar, GraduationCap, Code, Trophy, FileText, Activity, Database, Server, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';
import { api } from '../services/api';

const AdminView = ({ students, setStudents, setView, adminToken }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [dbStatus, setDbStatus] = useState('connected');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudents, setSelectedStudents] = useState([]); // New state for bulk selection
  const [isSearching, setIsSearching] = useState(false); // New state for search indicator
  const [semesters, setSemesters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const [semesterEditForm, setSemesterEditForm] = useState({});
  const [isAddingSemester, setIsAddingSemester] = useState(false);
  const [newSemesterForm, setNewSemesterForm] = useState({
    num: '',
    sgpa: '',
    subjects: [{ code: '', title: '', credits: 3, grade: 'O' }]
  });

  // Fetch all collections data on mount
  useEffect(() => {
    if (adminToken) {
      fetchAllCollections();
    }
  }, [adminToken]);

  const fetchAllCollections = async () => {
    try {
      const [studentsRes, semestersRes, projectsRes, coursesRes, achievementsRes] = await Promise.all([
        api.getAllStudents(),
        api.getAllSemesters(),
        api.getAllProjects(),
        api.getAllCourses(),
        api.getAllAchievements()
      ]);

      setStudents(studentsRes || []);
      setSemesters(semestersRes || []);
      setProjects(projectsRes || []);
      setCourses(coursesRes || []);
      setAchievements(achievementsRes || []);
      setDbStatus('connected');

      console.log('✅ All collections fetched successfully');
    } catch (error) {
      console.error('❌ Error fetching collections:', error);
      setDbStatus('error');
    }
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setEditForm({
      name: student.name,
      email: student.email || '',
      phone: student.phone || '',
      department: student.department || '',
      year: student.year || '',
      registerNumber: student.registerNumber
    });
  };

  const handleSaveEdit = async () => {
    try {
      await api.updateStudent(editForm.registerNumber, editForm);
      setIsEditing(false);
      setEditForm({});
      fetchAllCollections(); // Refresh data
      alert('Student data updated successfully!');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student data');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleEditSemester = (semester) => {
    setIsEditingSemester(true);
    setSemesterEditForm({
      _id: semester._id,
      num: semester.num,
      subjects: semester.subjects || [],
      sgpa: semester.sgpa || 0
    });
  };

  const handleSaveSemesterEdit = async () => {
    try {
      await api.updateSemester(semesterEditForm._id, semesterEditForm);
      setIsEditingSemester(false);
      setSemesterEditForm({});
      fetchAllCollections(); // Refresh data
      alert('Semester data updated successfully!');
    } catch (error) {
      console.error('Error updating semester:', error);
      alert('Failed to update semester data');
    }
  };

  const handleCancelSemesterEdit = () => {
    setIsEditingSemester(false);
    setSemesterEditForm({});
  };

  const updateSubjectInForm = (index, field, value) => {
    const updatedSubjects = [...semesterEditForm.subjects];
    updatedSubjects[index][field] = value;
    setSemesterEditForm({ ...semesterEditForm, subjects: updatedSubjects });
  };

  const handleAddSemester = () => {
    setIsAddingSemester(true);
    setNewSemesterForm({
      num: '',
      sgpa: '',
      subjects: [{ code: '', title: '', credits: 3, grade: 'O' }]
    });
  };

  const handleSaveNewSemester = async () => {
    try {
      if (!selectedStudent || !selectedStudent._id) {
        alert('Please select a student first');
        return;
      }

      if (!newSemesterForm.num || !newSemesterForm.sgpa) {
        alert('Please fill in semester number and SGPA');
        return;
      }

      const semesterData = {
        studentId: selectedStudent._id,
        num: parseInt(newSemesterForm.num),
        sgpa: parseFloat(newSemesterForm.sgpa),
        subjects: newSemesterForm.subjects.filter(subject => subject.code && subject.title)
      };

      console.log('Adding semester:', semesterData);
      await api.addSemester(semesterData);
      setIsAddingSemester(false);
      setNewSemesterForm({
        num: '',
        sgpa: '',
        subjects: [{ code: '', title: '', credits: 3, grade: 'O' }]
      });
      fetchAllCollections(); // Refresh data
      alert('Semester added successfully!');
    } catch (error) {
      console.error('Error adding semester:', error);
      alert('Failed to add semester: ' + error.message);
    }
  };

  const handleCancelAddSemester = () => {
    setIsAddingSemester(false);
    setNewSemesterForm({
      num: '',
      sgpa: '',
      subjects: [{ code: '', title: '', credits: 3, grade: 'O' }]
    });
  };

  const updateNewSubjectInForm = (index, field, value) => {
    const updatedSubjects = [...newSemesterForm.subjects];
    updatedSubjects[index][field] = value;
    setNewSemesterForm({ ...newSemesterForm, subjects: updatedSubjects });
  };

  const addNewSubject = () => {
    setNewSemesterForm({
      ...newSemesterForm,
      subjects: [...newSemesterForm.subjects, { code: '', title: '', credits: 3, grade: 'O' }]
    });
  };

  const removeNewSubject = (index) => {
    const updatedSubjects = newSemesterForm.subjects.filter((_, i) => i !== index);
    setNewSemesterForm({ ...newSemesterForm, subjects: updatedSubjects });
  };

  // Calculate enhanced statistics using actual collections data
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const avgCGPA = totalStudents > 0
      ? students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / totalStudents
      : 0;
    const totalSemestersFromStudents = students.reduce((sum, s) => sum + (s.semesters?.length || 0), 0);
    const highPerformers = students.filter(s => (s.cgpa || 0) >= 8).length;

    // Department statistics
    const deptStats = students.reduce((acc, student) => {
      const dept = student.department || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // Year statistics
    const yearStats = students.reduce((acc, student) => {
      const year = student.year || 'Unknown';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    // Use actual collections data
    const totalProjects = projects.length;
    const totalCourses = courses.length;
    const totalAchievements = achievements.length;

    // Use embedded semesters count as source of truth
    const totalSemesters = 8;

    // Arrears Stat
    const totalArrears = students.filter(s => (s.arrears || 0) > 0).length;

    return {
      totalStudents,
      avgCGPA,
      totalSemesters,
      totalSemestersFromStudents,
      highPerformers,
      deptStats,
      yearStats,
      departments: Object.keys(deptStats),
      years: Object.keys(yearStats),
      totalProjects,
      totalCourses,
      totalAchievements,
      totalArrears
    };
  }, [students, semesters, projects, courses, achievements]);

  // Filter and sort students with enhanced filtering
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(s => s.department === selectedDepartment);
    }

    // Apply year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(s => s.year === selectedYear);
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
        case 'department':
          return (a.department || '').localeCompare(b.department || '');
        case 'year':
          return (a.year || '').localeCompare(b.year || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, sortBy, filterBy, selectedDepartment, selectedYear]);

  // Handle advanced search via API
  const handleAdvancedSearch = async () => {
    setIsSearching(true);
    try {
      const params = {
        q: searchTerm,
        department: selectedDepartment !== 'all' ? selectedDepartment : '',
        year: selectedYear !== 'all' ? selectedYear : '',
        hasArrears: filterBy === 'arrears' ? 'true' : '',
        minCgpa: filterBy === 'high' ? '8' : (filterBy === 'medium' ? '6' : '')
      };
      const results = await api.searchStudents(params);
      setStudents(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Bulk Delete implementation
  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.length} students?`)) return;

    try {
      await api.bulkDeleteStudents(selectedStudents);
      alert('Students deleted successfully');
      setSelectedStudents([]);
      fetchAllCollections();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete students');
    }
  };

  const toggleStudentSelection = (regNum) => {
    setSelectedStudents(prev =>
      prev.includes(regNum)
        ? prev.filter(id => id !== regNum)
        : [...prev, regNum]
    );
  };

  const toggleAllSelection = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.registerNumber));
    }
  };

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

  const getPerformanceLabel = (cgpa) => {
    if (cgpa >= 8) return 'Excellent';
    if (cgpa >= 6) return 'Good';
    return 'Needs Improvement';
  };

  const exportData = (format) => {
    const data = filteredStudents.map(student => ({
      'Name': student.name,
      'Register Number': student.registerNumber,
      'Email': student.email || '',
      'Phone': student.phone || '',
      'Department': student.department || '',
      'Year': student.year || '',
      'CGPA': student.cgpa || 0,
      'Semesters': student.semesters?.length || 0,
      'Projects': student.projects?.length || 0,
      'Courses': student.extraCourses?.length || 0,
      'Achievements': student.achievements?.length || 0,
      'Performance': getPerformanceLabel(student.cgpa || 0)
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Simulate data refresh - in real app, this would refetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDbStatus('connected');
    } catch (error) {
      setDbStatus('error');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 px-6 py-6 sticky top-0 z-30 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Database size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white">MongoDB Admin Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <Server size={14} />
                Connected to edutrack database
                <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => exportData('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <ThemeToggle />
            <button onClick={() => setView('landing')} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-red-500 transition-all border border-slate-200 dark:border-slate-600">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto p-6 space-y-8">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalStudents}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Total Students</p>
            <div className="mt-2 text-xs text-slate-500">
              {stats.departments.length} departments
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.avgCGPA.toFixed(2)}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Average CGPA</p>
            <div className="mt-2 text-xs text-slate-500">
              {stats.highPerformers} high performers
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalSemesters}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Total Semesters</p>
            <div className="mt-2 text-xs text-slate-500">
              Standard Duration
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Award size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.highPerformers}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">High Performers</p>
            <div className="mt-2 text-xs text-slate-500">
              {((stats.highPerformers / stats.totalStudents) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Code size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalProjects}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Total Projects</p>
            <div className="mt-2 text-xs text-slate-500">
              Student projects
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalAchievements}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Achievements</p>
            <div className="mt-2 text-xs text-slate-500">
              Student awards
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertCircle size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalArrears}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Students with Arrears</p>
            <div className="mt-2 text-xs text-slate-500">
              Needs attention
            </div>
          </div>
        </div>

        {/* Department and Year Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap size={20} />
              Department Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.deptStats).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{dept}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(count / stats.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Year Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.yearStats).map(([year, count]) => (
                <div key={year} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{year}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${(count / stats.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Search & Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Filter size={16} />
              {showFilters ? 'Hide' : 'Show'} Filters
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, register number, or email..."
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
              <option value="department">Sort by Department</option>
              <option value="year">Sort by Year</option>
            </select>
            <button
              onClick={handleAdvancedSearch}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
              disabled={isSearching}
            >
              <Search size={18} />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="all">All Performance Levels</option>
                <option value="high">High Performers (8+ CGPA)</option>
                <option value="medium">Average (6-8 CGPA)</option>
                <option value="low">Below Average (&lt;6 CGPA)</option>
              </select>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="all">All Departments</option>
                {stats.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="all">All Years</option>
                {stats.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        {/* Enhanced Student List */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Student Records</h2>
            <div className="flex items-center gap-4">
              {selectedStudents.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedStudents.length})
                </button>
              )}
              <button
                onClick={toggleAllSelection}
                className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {searchTerm || filterBy !== 'all' || selectedDepartment !== 'all' || selectedYear !== 'all'
                  ? 'No students found matching your criteria'
                  : 'No students available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredStudents.map((student) => (
                <div key={student._id} className={`p-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-all ${selectedStudents.includes(student.registerNumber) ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.registerNumber)}
                      onChange={() => toggleStudentSelection(student.registerNumber)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">{student.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPerformanceBadge(student.cgpa || 0)}`}>
                          {student.cgpa?.toFixed(2) || '0.00'} CGPA
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                        {student.registerNumber}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <GraduationCap size={14} />
                          {student.department || 'N/A'}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar size={14} />
                          {student.year || 'N/A'}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-700 dark:text-slate-300">{student.semesters?.length || 0}</strong> semesters
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-700 dark:text-slate-300">{student.projects?.length || 0}</strong> projects
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-700 dark:text-slate-300">{student.achievements?.length || 0}</strong> awards
                        </span>
                        {student.email && (
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Mail size={14} />
                            {student.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getPerformanceColor(student.cgpa || 0)}`}>
                          {student.cgpa?.toFixed(2) || '0.00'}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          {getPerformanceLabel(student.cgpa || 0)}
                        </p>
                      </div>
                      <button
                        onClick={() => viewStudentDetails(student)}
                        className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 rounded-lg bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800"
                        title="Edit Student"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Student Details</h2>
                <button
                  onClick={() => setShowStudentDetails(false)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Tabs Navigation */}
              <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('semesters')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'semesters'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  Semesters
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'achievements'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  Achievements
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Users size={20} />
                      Personal Information
                      {!isEditing && (
                        <button
                          onClick={() => handleEdit(selectedStudent)}
                          className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Phone</label>
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Department</label>
                          <input
                            type="text"
                            value={editForm.department}
                            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Year</label>
                          <input
                            type="text"
                            value={editForm.year}
                            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 dark:text-slate-400 w-20">Name:</span>
                          <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 dark:text-slate-400 w-20">Email:</span>
                          <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 dark:text-slate-400 w-20">Phone:</span>
                          <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.phone || 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <GraduationCap size={20} />
                      Academic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 dark:text-slate-400 w-20">Reg No:</span>
                        <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.registerNumber}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 dark:text-slate-400 w-20">Dept:</span>
                        <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.department || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 dark:text-slate-400 w-20">Year:</span>
                        <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.year || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Trophy size={20} />
                      Performance Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedStudent.cgpa?.toFixed(2) || '0.00'}</div>
                        <div className="text-xs text-blue-500 dark:text-blue-400">CGPA</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedStudent.semesters?.length || 0}</div>
                        <div className="text-xs text-purple-500 dark:text-purple-400">Semesters</div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{selectedStudent.projects?.length || 0}</div>
                        <div className="text-xs text-indigo-500 dark:text-indigo-400">Projects</div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{selectedStudent.achievements?.length || 0}</div>
                        <div className="text-xs text-yellow-500 dark:text-yellow-400">Achievements</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Database size={20} />
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Last updated: {new Date(selectedStudent.updatedAt || Date.now()).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <Activity size={16} className="text-blue-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Current Semester: {selectedStudent.currentSemester || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'semesters' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BookOpen size={20} />
                    Semester Details
                    <button
                      onClick={handleAddSemester}
                      className="ml-auto px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Add Semester
                    </button>
                  </h3>
                  {isAddingSemester && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-bold text-slate-800 dark:text-white mb-4">Add New Semester</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Semester Number</label>
                          <input
                            type="number"
                            value={newSemesterForm.num}
                            onChange={(e) => setNewSemesterForm({ ...newSemesterForm, num: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            min="1"
                            max="8"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">SGPA</label>
                          <input
                            type="number"
                            value={newSemesterForm.sgpa}
                            onChange={(e) => setNewSemesterForm({ ...newSemesterForm, sgpa: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            min="0"
                            max="10"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Subjects</label>
                          {newSemesterForm.subjects.map((subject, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                              <input
                                type="text"
                                value={subject.code}
                                onChange={(e) => updateNewSubjectInForm(index, 'code', e.target.value)}
                                placeholder="Code"
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                              />
                              <input
                                type="text"
                                value={subject.title}
                                onChange={(e) => updateNewSubjectInForm(index, 'title', e.target.value)}
                                placeholder="Subject Name"
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                              />
                              <input
                                type="number"
                                value={subject.credits}
                                onChange={(e) => updateNewSubjectInForm(index, 'credits', parseFloat(e.target.value))}
                                placeholder="Credits"
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                min="1"
                                max="10"
                              />
                              <select
                                value={subject.grade}
                                onChange={(e) => updateNewSubjectInForm(index, 'grade', e.target.value)}
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                              >
                                <option value="O">O</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="P">P</option>
                                <option value="F">F</option>
                              </select>
                              <button
                                onClick={() => removeNewSubject(index)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={addNewSubject}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add Subject
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveNewSemester}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Save Semester
                          </button>
                          <button
                            onClick={handleCancelAddSemester}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedStudent.semesters && selectedStudent.semesters.length > 0 ? (
                    selectedStudent.semesters.map(semester => (
                      <div key={semester.num} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                        {isEditingSemester && semesterEditForm.num === semester.num ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Semester Number</label>
                              <input
                                type="number"
                                value={semesterEditForm.num}
                                onChange={(e) => setSemesterEditForm({ ...semesterEditForm, num: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                min="1"
                                max="8"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">SGPA</label>
                              <input
                                type="number"
                                value={semesterEditForm.sgpa}
                                onChange={(e) => setSemesterEditForm({ ...semesterEditForm, sgpa: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                min="0"
                                max="10"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Subjects</label>
                              {semesterEditForm.subjects.map((subject, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                                  <input
                                    type="text"
                                    value={subject.code}
                                    onChange={(e) => updateSubjectInForm(index, 'code', e.target.value)}
                                    placeholder="Code"
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                  />
                                  <input
                                    type="text"
                                    value={subject.title}
                                    onChange={(e) => updateSubjectInForm(index, 'title', e.target.value)}
                                    placeholder="Subject Name"
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                  />
                                  <input
                                    type="number"
                                    value={subject.credits}
                                    onChange={(e) => updateSubjectInForm(index, 'credits', parseFloat(e.target.value))}
                                    placeholder="Credits"
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                    min="1"
                                    max="10"
                                  />
                                  <select
                                    value={subject.grade}
                                    onChange={(e) => updateSubjectInForm(index, 'grade', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                  >
                                    <option value="O">O</option>
                                    <option value="A+">A+</option>
                                    <option value="A">A</option>
                                    <option value="B+">B+</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="P">P</option>
                                    <option value="F">F</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={handleSaveSemesterEdit}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelSemesterEdit}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">Semester {semester.num}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">SGPA: {semester.sgpa?.toFixed(2) || '0.00'}</p>
                              </div>
                              {/* Edit button disabled for embedded view for now, or need to adjust handleEditSemester */}
                            </div>
                            <div className="space-y-2">
                              {semester.subjects?.map((subject, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="text-slate-600 dark:text-slate-400">{subject.code} - {subject.title}</span>
                                  <span className="text-slate-800 dark:text-white font-medium">{subject.grade} ({subject.credits} credits)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">No semesters found</p>
                  )}
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Code size={20} />
                    Student Projects
                  </h3>
                  {/* Department Filter */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Filter by Department:</label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      >
                        <option value="all">All Departments</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="EEE">Electrical</option>
                        <option value="MECH">Mechanical</option>
                        <option value="CIVIL">Civil</option>
                        <option value="IT">Information Technology</option>
                      </select>
                    </div>
                  </div>
                  {projects.filter(p => {
                    // Handle both populated and non-populated data
                    let studentMatch = false;
                    if (typeof p.studentId === 'object' && p.studentId !== null) {
                      studentMatch = p.studentId.registerNumber === selectedStudent.registerNumber;
                    } else {
                      studentMatch = p.studentId === selectedStudent._id;
                    }

                    // Apply department filter if not "all"
                    if (selectedDepartment !== 'all' && selectedStudent.department !== selectedDepartment) {
                      return false;
                    }

                    return studentMatch;
                  }).map(project => (
                    <div key={project._id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                      <h4 className="font-bold text-slate-800 dark:text-white mb-2">{project.name}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.pdfFileName && (
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-red-500" />
                          <button
                            onClick={() => window.open(`http://localhost:5000/uploads/projects/${project.pdfFileName}`, '_blank')}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                          >
                            View PDF: {project.pdfFileName}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {projects.filter(p => {
                    let studentMatch = false;
                    if (typeof p.studentId === 'object' && p.studentId !== null) {
                      studentMatch = p.studentId.registerNumber === selectedStudent.registerNumber;
                    } else {
                      studentMatch = p.studentId === selectedStudent._id;
                    }

                    if (selectedDepartment !== 'all' && selectedStudent.department !== selectedDepartment) {
                      return false;
                    }

                    return studentMatch;
                  }).length === 0 && (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-8">No projects found</p>
                    )}
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BookOpen size={20} />
                    Extra Courses
                  </h3>
                  {/* Department Filter */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Filter by Department:</label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      >
                        <option value="all">All Departments</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="EEE">Electrical</option>
                        <option value="MECH">Mechanical</option>
                        <option value="CIVIL">Civil</option>
                        <option value="IT">Information Technology</option>
                      </select>
                    </div>
                  </div>
                  {courses.filter(c => {
                    // Handle both populated and non-populated data
                    let studentMatch = false;
                    if (typeof c.studentId === 'object' && c.studentId !== null) {
                      studentMatch = c.studentId.registerNumber === selectedStudent.registerNumber;
                    } else {
                      studentMatch = c.studentId === selectedStudent._id;
                    }

                    // Apply department filter if not "all"
                    if (selectedDepartment !== 'all' && selectedStudent.department !== selectedDepartment) {
                      return false;
                    }

                    return studentMatch;
                  }).map(course => (
                    <div key={course._id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                      <h4 className="font-bold text-slate-800 dark:text-white mb-2">{course.name}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{course.provider}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{course.description}</p>
                      {course.skills && course.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {course.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {course.certificateFileName && (
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-green-500" />
                          <button
                            onClick={() => window.open(`http://localhost:5000/uploads/courses/${course.certificateFileName}`, '_blank')}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                          >
                            View Certificate: {course.certificateFileName}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {courses.filter(c => {
                    let studentMatch = false;
                    if (typeof c.studentId === 'object' && c.studentId !== null) {
                      studentMatch = c.studentId.registerNumber === selectedStudent.registerNumber;
                    } else {
                      studentMatch = c.studentId === selectedStudent._id;
                    }

                    if (selectedDepartment !== 'all' && selectedStudent.department !== selectedDepartment) {
                      return false;
                    }

                    return studentMatch;
                  }).length === 0 && (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-8">No courses found</p>
                    )}
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Trophy size={20} />
                    Student Achievements
                  </h3>
                  {achievements.filter(a => {
                    // Handle both populated and non-populated data
                    if (typeof a.studentId === 'object' && a.studentId !== null) {
                      // Populated data - compare registerNumber
                      return a.studentId.registerNumber === selectedStudent.registerNumber;
                    } else {
                      // Non-populated data - compare ObjectId
                      return a.studentId === selectedStudent._id;
                    }
                  }).map(achievement => (
                    <div key={achievement._id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                      <h4 className="font-bold text-slate-800 dark:text-white mb-2">{achievement.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{achievement.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                        {achievement.level && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                            {achievement.level}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {achievements.filter(a => {
                    if (typeof a.studentId === 'object' && a.studentId !== null) {
                      return a.studentId.registerNumber === selectedStudent.registerNumber;
                    } else {
                      return a.studentId === selectedStudent._id;
                    }
                  }).length === 0 && (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-8">No achievements found</p>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
