import React, { useState } from 'react';
import { FollowUpTask } from '../types';
import { Clock, User, Phone, Check, ChevronRight } from 'lucide-react';
import { getUrgencyBadge } from '../lib/utils';
import { Language, translations } from '../lib/i18n';

interface TaskSchedulerViewProps {
  tasks: FollowUpTask[];
  onUpdateStatus: (taskId: string, status: FollowUpTask['status']) => void;
  onSelectCall: (callId: string) => void;
  onSelectCustomer: (customerId: string) => void;
  lang: Language;
}

export const TaskSchedulerView: React.FC<TaskSchedulerViewProps> = ({
  tasks,
  onUpdateStatus,
  onSelectCall,
  onSelectCustomer,
  lang
}) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const t = translations[lang];
  const isRtl = lang === 'fa';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{t.taskScheduler.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.taskScheduler.subtitle}</p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map(f => {
            const label = f === 'All' ? t.taskScheduler.all : f === 'Pending' ? t.taskScheduler.pending : f === 'In Progress' ? t.taskScheduler.inProgress : t.taskScheduler.completed;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Cards: Clean Vertical Stack */}
      <div className="flex flex-col space-y-4">
        {filteredTasks.map(task => {
          const urgencyBadge = getUrgencyBadge(task.priority, lang);
          const isDone = task.status === 'Completed';

          return (
            <div
              key={task.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                isDone
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold ${urgencyBadge.className}`}>
                    {urgencyBadge.label} {t.taskScheduler.priority}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                    isDone 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                  }`}>
                    {task.status === 'Completed' ? t.taskScheduler.completed : task.status === 'In Progress' ? t.taskScheduler.inProgress : t.taskScheduler.pending}
                  </span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                    <Clock className="w-4 h-4" />
                    {task.deadline}
                  </span>
                </div>

                <h3 className={`text-lg font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {task.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
                  {task.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                    <User className="w-4 h-4 text-slate-400" />
                    <button
                      onClick={() => onSelectCustomer(task.customerId)}
                      className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    >
                      {task.customerName}
                    </button>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{t.taskScheduler.assignedStaff}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{task.staffName}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 md:pl-6 rtl:md:pl-0 rtl:md:pr-6">
                <button
                  onClick={() => onUpdateStatus(task.id, isDone ? 'Pending' : 'Completed')}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isDone
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isDone ? t.taskScheduler.markPending : t.taskScheduler.complete}</span>
                </button>

                <button
                  onClick={() => onSelectCall(task.callId)}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>{t.taskScheduler.viewCallContext}</span>
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
