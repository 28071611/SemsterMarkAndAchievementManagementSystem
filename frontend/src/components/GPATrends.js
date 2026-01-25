import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const GPATrends = ({ semesters }) => {
  if (!semesters || semesters.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4">GPA Trends</h3>
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No semester data available
        </div>
      </div>
    );
  }

  const sortedSemesters = [...semesters].sort((a, b) => a.num - b.num);
  const maxSGPA = Math.max(...sortedSemesters.map(s => s.sgpa));
  const minSGPA = Math.min(...sortedSemesters.map(s => s.sgpa));
  
  const getTrendIcon = (current, previous) => {
    if (!previous) return <Minus size={16} className="text-slate-400" />;
    if (current > previous) return <TrendingUp size={16} className="text-green-500" />;
    if (current < previous) return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  const getBarHeight = (sgpa) => {
    return `${(sgpa / 10) * 100}%`;
  };

  const getBarColor = (sgpa) => {
    if (sgpa >= 8) return 'bg-green-500';
    if (sgpa >= 6) return 'bg-yellow-500';
    if (sgpa >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-slate-800 dark:text-white">GPA Trends</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">Excellent (8+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">Good (6-8)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">Average (4-6)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between h-40 px-4">
          {sortedSemesters.map((sem, index) => {
            const prevSem = sortedSemesters[index - 1];
            return (
              <div key={sem.num} className="flex flex-col items-center flex-1">
                <div className="relative w-full flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-2">
                    {getTrendIcon(sem.sgpa, prevSem?.sgpa)}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {sem.sgpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-8 bg-slate-200 dark:bg-slate-700 rounded-t-lg relative overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full ${getBarColor(sem.sgpa)} transition-all duration-500`}
                      style={{ height: getBarHeight(sem.sgpa) }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
                  Sem {sem.num}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-black text-green-600 dark:text-green-400">{maxSGPA.toFixed(2)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Highest SGPA</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-slate-600 dark:text-slate-400">
              {(sortedSemesters.reduce((acc, s) => acc + s.sgpa, 0) / sortedSemesters.length).toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Average SGPA</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-red-600 dark:text-red-400">{minSGPA.toFixed(2)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Lowest SGPA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPATrends;
