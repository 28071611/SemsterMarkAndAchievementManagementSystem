import { GRADE_POINTS } from '../constants/constants';

export const addStudent = (students, setStudents, newStudent) => {
  if(!newStudent.id || !newStudent.name) return;
  setStudents(prev => [...prev, { 
    ...newStudent, 
    semesters: [], 
    cgpa: 0
  }]);
};

export const saveSemesterData = (students, setStudents, studentId, semesterData) => {
  setStudents(prev => prev.map(s => {
    if (s.id === studentId) {
      const otherSemesters = s.semesters.filter(sem => sem.num !== semesterData.num);
      
      // Calculate SGPA using Letter Grades
      let totalWeightedPoints = 0;
      let totalCredits = 0;
      semesterData.subjects.forEach(sub => {
        totalWeightedPoints += (GRADE_POINTS[sub.grade] || 0) * sub.credits;
        totalCredits += sub.credits;
      });
      const sgpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits) : 0;
      
      const updatedSemesters = [...otherSemesters, { ...semesterData, sgpa, totalCredits }].sort((a, b) => a.num - b.num);
      
      // Calculate CGPA
      let cumulativePoints = 0;
      let cumulativeCredits = 0;
      updatedSemesters.forEach(sem => {
        sem.subjects.forEach(sub => {
          cumulativePoints += (GRADE_POINTS[sub.grade] || 0) * sub.credits;
          cumulativeCredits += sub.credits;
        });
      });
      const cgpa = cumulativeCredits > 0 ? (cumulativePoints / cumulativeCredits) : 0;

      return { ...s, semesters: updatedSemesters, cgpa };
    }
    return s;
  }));
};
