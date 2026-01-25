import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-12 w-12 rounded-2xl" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

export const SkeletonSemesterCard = () => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-8 border-b border-slate-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-2xl">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonAcademicForm = () => (
  <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-slate-100">
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-20 rounded-2xl" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 p-4 bg-slate-50 rounded-3xl">
            <Skeleton className="col-span-2 h-10 rounded-xl" />
            <Skeleton className="col-span-5 h-10 rounded-xl" />
            <Skeleton className="col-span-2 h-10 rounded-xl" />
            <Skeleton className="col-span-2 h-10 rounded-xl" />
            <Skeleton className="col-span-1 h-10 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Skeleton className="flex-1 h-14 rounded-3xl" />
        <Skeleton className="w-32 h-14 rounded-3xl" />
      </div>
    </div>
  </div>
);

export const SkeletonStudentList = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
