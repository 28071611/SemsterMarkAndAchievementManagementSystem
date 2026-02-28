
// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  },

  // --- New Feature Endpoints ---

  async searchStudents(params) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/students/search?${query}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Stats error:', error);
      throw error;
    }
  },

  async bulkDeleteStudents(registerNumbers) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumbers })
      });
      if (!response.ok) throw new Error('Bulk delete failed');
      return await response.json();
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  },

  async changePassword(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Password change failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // --- Projects ---

  async addProject(registerNumber, data) {
    try {
      const formData = new FormData();
      if (data.pdfFile) {
        formData.append('pdfFile', data.pdfFile);
        delete data.pdfFile;
      }
      formData.append('projectData', JSON.stringify(data));

      const response = await fetch(`${API_BASE_URL}/projects/student/${registerNumber}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add project');
      return await response.json();
    } catch (error) {
      console.error('Add project error:', error);
      throw error;
    }
  },

  async updateProject(projectId, data) {
    try {
      const formData = new FormData();
      if (data.pdfFile) {
        formData.append('pdfFile', data.pdfFile);
        delete data.pdfFile;
      }
      formData.append('projectData', JSON.stringify(data));

      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update project');
      return await response.json();
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  },

  async deleteProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return await response.json();
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  },

  // --- Courses ---

  async addCourse(registerNumber, data) {
    try {
      const formData = new FormData();
      if (data.certificateFile) {
        formData.append('certificateFile', data.certificateFile);
        delete data.certificateFile;
      }
      formData.append('courseData', JSON.stringify(data));

      const response = await fetch(`${API_BASE_URL}/courses/student/${registerNumber}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add course');
      return await response.json();
    } catch (error) {
      console.error('Add course error:', error);
      throw error;
    }
  },

  async updateCourse(courseId, data) {
    try {
      const formData = new FormData();
      if (data.certificateFile) {
        formData.append('certificateFile', data.certificateFile);
        delete data.certificateFile;
      }
      formData.append('courseData', JSON.stringify(data));

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update course');
      return await response.json();
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  },

  async deleteCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete course');
      return await response.json();
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  },

  // --- Achievements ---

  async addAchievement(registerNumber, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements/student/${registerNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementData: data }),
      });
      if (!response.ok) throw new Error('Failed to add achievement');
      return await response.json();
    } catch (error) {
      console.error('Add achievement error:', error);
      throw error;
    }
  },

  async updateAchievement(achievementId, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementData: data }),
      });
      if (!response.ok) throw new Error('Failed to update achievement');
      return await response.json();
    } catch (error) {
      console.error('Update achievement error:', error);
      throw error;
    }
  },

  async deleteAchievement(achievementId) {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete achievement');
      return await response.json();
    } catch (error) {
      console.error('Delete achievement error:', error);
      throw error;
    }
  }
};
