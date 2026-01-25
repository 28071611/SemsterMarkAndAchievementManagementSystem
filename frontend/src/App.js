import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import StudentLogin from './components/StudentLogin';
import StudentSignup from './components/StudentSignup';
import StudentPortal from './components/StudentPortal';
import AdminView from './components/AdminViewEnhanced';
import { api } from './services/api';
import { ADMIN_CREDENTIALS } from './constants/constants';

const AppContent = () => {
  const [view, setView] = useState('landing'); 
  const [students, setStudents] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);
  const [showAdminLock, setShowAdminLock] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [passError, setPassError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  const { addToast } = useToast();

  const handleStudentLogin = async (regNo, name) => {
    setLoading(true);
    try {
      const student = await api.addOrLoginStudent(name, regNo);
      setActiveStudent(student);
      setView('student');
      addToast(`Welcome back, ${student.name}!`, 'success');
    } catch (error) {
      console.error('Login failed:', error);
      addToast('Failed to login. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSignup = async (studentData) => {
    setLoading(true);
    try {
      const student = await api.registerStudent(studentData);
      setActiveStudent(student);
      setView('student');
      addToast(`Registration successful! Welcome, ${student.name}!`, 'success');
    } catch (error) {
      console.error('Signup failed:', error);
      addToast(error.message || 'Failed to register. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSemesterData = async (studentId, semesterData) => {
    setLoading(true);
    try {
      const updatedStudent = await api.addSemester(studentId, semesterData);
      setActiveStudent(updatedStudent);
      addToast(`Semester ${semesterData.num} added successfully!`, 'success');
    } catch (error) {
      console.error('Failed to save semester:', error);
      addToast('Failed to save semester. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    console.log('Login attempt:', { adminUsername, adminPassword });
    console.log('Expected credentials:', ADMIN_CREDENTIALS);
    
    if (adminUsername.trim() === ADMIN_CREDENTIALS.username && adminPassword.trim() === ADMIN_CREDENTIALS.password) {
      setLoading(true);
      try {
        // Simulate admin authentication
        const token = 'admin-token-' + Date.now();
        setAdminToken(token);
        
        // Fetch all collections data
        try {
          const [allStudents, allSemesters, allProjects, allCourses, allAchievements] = await Promise.all([
            api.getAllStudents(token),
            api.getAllSemesters(token),
            api.getAllProjects(token),
            api.getAllCourses(token),
            api.getAllAchievements(token)
          ]);
          
          setStudents(allStudents);
          console.log('Fetched data:', {
            students: allStudents.length,
            semesters: allSemesters.length,
            projects: allProjects.length,
            courses: allCourses.length,
            achievements: allAchievements.length
          });
        } catch (studentError) {
          console.warn('Could not fetch data from backend, using empty arrays');
          setStudents([]);
        }
        
        setView('admin');
        setShowAdminLock(false);
        setPassError(false);
        addToast('Admin login successful!', 'success');
      } catch (error) {
        console.error('Admin login failed:', error);
        setPassError(true);
        addToast('Admin login failed. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Authentication failed');
      setPassError(true);
      addToast('Invalid admin credentials.', 'error');
      // Clear form fields on failed attempt
      setAdminUsername('');
      setAdminPassword('');
    }
  };

  const handleAdminUnlock = () => {
    handleAdminLogin();
  };

  const handleStudentProfileUpdate = async (registerNumber, profileData) => {
    setLoading(true);
    try {
      // Update student profile API call would go here
      // For now, just update local state
      setActiveStudent(prev => ({
        ...prev,
        ...profileData
      }));
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && view === 'landing') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  switch(view) {
    case 'admin': 
      return <AdminView students={students} setView={setView} adminToken={adminToken} />;
    case 'student-login': 
      return <StudentLogin onLogin={handleStudentLogin} loading={loading} />;
    case 'student-signup': 
      return <StudentSignup onSignup={handleStudentSignup} onBackToLogin={() => setView('student-login')} loading={loading} />;
    case 'student': 
      return (
        <StudentPortal 
          activeStudent={activeStudent}
          setActiveStudent={setActiveStudent}
          setView={setView}
          saveSemesterData={handleSaveSemesterData}
          onProfileUpdate={handleStudentProfileUpdate}
          loading={loading}
          adminToken={adminToken}
        />
      );
    default: 
      return (
        <LandingPage 
          setView={setView}
          showAdminLock={showAdminLock}
          setShowAdminLock={setShowAdminLock}
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          passError={passError}
          setPassError={setPassError}
          onAdminUnlock={handleAdminUnlock}
        />
      );
  }
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
