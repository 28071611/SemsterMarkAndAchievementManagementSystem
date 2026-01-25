import React from 'react';
import { Download, FileText, Table } from 'lucide-react';

const ExportOptions = ({ student, onExport }) => {
  const handleExportPDF = () => {
    // Generate PDF content
    const content = generatePDFContent(student);
    onExport('pdf', content, `${student.name}_academic_record.pdf`);
  };

  const handleExportExcel = () => {
    // Generate Excel content
    const content = generateExcelContent(student);
    onExport('excel', content, `${student.name}_academic_record.xlsx`);
  };

  const generatePDFContent = (student) => {
    return `
      <html>
        <head>
          <title>Academic Record - ${student.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .student-info { margin-bottom: 20px; }
            .semester { margin-bottom: 20px; page-break-inside: avoid; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EduTrack - Academic Record</h1>
            <h2>${student.name}</h2>
            <p>Register Number: ${student.registerNumber}</p>
          </div>
          
          <div class="summary">
            <h3>Academic Summary</h3>
            <p><strong>Cumulative GPA:</strong> ${student.cgpa.toFixed(2)}</p>
            <p><strong>Total Semesters:</strong> ${student.semesters?.length || 0}</p>
            <p><strong>Total Credits:</strong> ${student.semesters?.reduce((acc, sem) => acc + (sem.totalCredits || 0), 0) || 0}</p>
          </div>

          ${student.semesters?.map(sem => `
            <div class="semester">
              <h3>Semester ${sem.num}</h3>
              <p><strong>SGPA:</strong> ${sem.sgpa.toFixed(2)} | <strong>Credits:</strong> ${sem.totalCredits}</p>
              <table>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Credits</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  ${sem.subjects.map(sub => `
                    <tr>
                      <td>${sub.code}</td>
                      <td>${sub.title}</td>
                      <td>${sub.credits}</td>
                      <td>${sub.grade}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('') || '<p>No semester data available</p>'}
        </body>
      </html>
    `;
  };

  const generateExcelContent = (student) => {
    let csvContent = "Academic Record\n\n";
    csvContent += `Student Name,${student.name}\n`;
    csvContent += `Register Number,${student.registerNumber}\n`;
    csvContent += `Cumulative GPA,${student.cgpa.toFixed(2)}\n`;
    csvContent += `Total Semesters,${student.semesters?.length || 0}\n\n`;

    if (student.semesters && student.semesters.length > 0) {
      csvContent += "Semester Details\n";
      csvContent += "Semester,Course Code,Course Title,Credits,Grade,SGPA\n";
      
      student.semesters.forEach(sem => {
        sem.subjects.forEach(sub => {
          csvContent += `${sem.num},${sub.code},${sub.title},${sub.credits},${sub.grade},${sem.sgpa.toFixed(2)}\n`;
        });
      });
    }

    return csvContent;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4">Export Records</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
        >
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-800 dark:text-white">Export as PDF</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Download formatted academic record</p>
          </div>
          <Download size={20} className="text-slate-400 ml-auto" />
        </button>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
        >
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
            <Table size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-800 dark:text-white">Export as Excel</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Download data for analysis</p>
          </div>
          <Download size={20} className="text-slate-400 ml-auto" />
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <p className="text-sm text-blue-800 dark:text-blue-400">
          <strong>Note:</strong> Export functionality generates downloadable files with your complete academic records.
        </p>
      </div>
    </div>
  );
};

export default ExportOptions;
