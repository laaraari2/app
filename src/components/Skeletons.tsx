import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse space-y-4 border border-slate-200/60 dark:border-slate-800">
    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4" />
    <div className="space-y-2">
      <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-md w-full" />
      <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6" />
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-pulse">
    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-4 items-center">
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
      </div>
    ))}
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 animate-pulse">
    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3 mx-auto" />
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);
