
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // --- Student Endpoints ---

  async getAllStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  async getStudent(registerNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${registerNumber}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Student not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  async updateStudent(registerNumber, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${registerNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update student');
      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  async addOrLoginStudent(name, registerNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, registerNumber })
      });
      if (!response.ok) throw new Error('Login failed');
      return await response.json();
    } catch (error) {
      console.error('Error login/add student:', error);
      throw error;
    }
  },

  async registerStudent(studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (!response.ok) throw new Error('Registration failed');
      return await response.json();
    } catch (error) {
      console.error('Error registering student:', error);
      throw error;
    }
  },


  // --- Semester Endpoints ---

  async getAllSemesters() {
    try {
      const response = await fetch(`${API_BASE_URL}/semesters`);
      if (!response.ok) throw new Error('Failed to fetch semesters');
      return await response.json();
    } catch (error) {
      console.error('Error fetching semesters:', error);
      return []; // Return empty if failed or endpoint doesn't exist yet
    }
  },

  async updateSemester(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/semesters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update semester');
      return await response.json();
    } catch (error) {
      console.error('Error updating semester:', error);
      throw error;
    }
  },

  async addSemester(data) {
    // Handle both (studentId, data) format or single data object
    const semesterData = arguments.length === 2 ? arguments[1] : arguments[0];
    const studentId = arguments.length === 2 ? arguments[0] : semesterData.studentId;

    // If passing studentId separately, ensure it's in the body
    if (arguments.length === 2) {
      semesterData.studentId = studentId;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/semesters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(semesterData)
      });
      if (!response.ok) throw new Error('Failed to add semester');
      return await response.json();
    } catch (error) {
      console.error('Error adding semester:', error);
      throw error;
    }
  },


  // --- Other Collections ---

  async getAllProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async getAllCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async getAllAchievements() {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  }
};
