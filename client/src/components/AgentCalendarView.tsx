import React, { useState, useMemo } from 'react';
import { FollowUpTask, CallRecord, Customer } from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Check, 
  CalendarDays, 
  User,
  CalendarPlus
} from 'lucide-react';
import { 
  formatDateKey, 
  formatDisplayDate, 
  formatDisplayTime, 
  getUrgencyBadge, 
  formatDuration 
} from '../lib/utils';
import { Language, translations } from '../lib/i18n';

interface AgentCalendarViewProps {
  agentName: string;
  tasks: FollowUpTask[];
  calls: CallRecord[];
  customers: Customer[];
  onUpdateTaskStatus: (taskId: string, status: FollowUpTask['status']) => void;
  onSelectCustomer?: (customerId: string) => void;
  onAddTaskModalOpen?: (defaultDateKey?: string) => void;
  lang: Language;
}

type CalendarViewMode = 'month' | 'week' | 'day';
type ItemFilter = 'all' | 'pending' | 'completed' | 'calls';

export const AgentCalendarView: React.FC<AgentCalendarViewProps> = ({
  agentName,
  tasks,
  calls,
  customers,
  onUpdateTaskStatus,
  onSelectCustomer: _onSelectCustomer,
  onAddTaskModalOpen,
  lang
}) => {
  const t = translations[lang];
  const isFa = lang === 'fa';

  // Base current selected date (defaults to 2026-11-15, which matches prototype data)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Check if there are tasks with due dates, pick the closest or fallback to 2026-11-15
    return new Date('2026-11-15T12:00:00Z');
  });

  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [itemFilter, setItemFilter] = useState<ItemFilter>('all');

  const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

  // Group tasks by date key
  const tasksByDate = useMemo(() => {
    const map = new Map<string, FollowUpTask[]>();
    tasks.forEach(task => {
      let key = '';
      if (task.dueTime) {
        const d = new Date(task.dueTime);
        if (!isNaN(d.getTime())) {
          key = formatDateKey(d);
        }
      }
      if (!key && task.createdAt) {
        const d = new Date(task.createdAt);
        if (!isNaN(d.getTime())) {
          key = formatDateKey(d);
        }
      }
      if (!key) key = '2026-11-15';

      const existing = map.get(key) || [];
      existing.push(task);
      map.set(key, existing);
    });
    return map;
  }, [tasks]);

  // Group calls by date key
  const callsByDate = useMemo(() => {
    const map = new Map<string, CallRecord[]>();
    calls.forEach(call => {
      const d = new Date(call.startTime);
      const key = !isNaN(d.getTime()) ? formatDateKey(d) : '2026-11-15';
      const existing = map.get(key) || [];
      existing.push(call);
      map.set(key, existing);
    });
    return map;
  }, [calls]);

  // Items for the selected date
  const selectedDateTasks = useMemo(() => {
    const list = tasksByDate.get(selectedDateKey) || [];
    if (itemFilter === 'pending') {
      return list.filter(t => t.status !== 'Completed');
    }
    if (itemFilter === 'completed') {
      return list.filter(t => t.status === 'Completed');
    }
    if (itemFilter === 'calls') {
      return [];
    }
    return list;
  }, [tasksByDate, selectedDateKey, itemFilter]);

  const selectedDateCalls = useMemo(() => {
    if (itemFilter === 'pending' || itemFilter === 'completed') {
      return [];
    }
    return callsByDate.get(selectedDateKey) || [];
  }, [callsByDate, selectedDateKey, itemFilter]);

  // Month grid generation
  const monthDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: { date: Date; dateKey: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Weekday of first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // In Persian calendar, weeks start on Saturday (6), in Western it starts on Sunday (0) or Monday (1).
    // Let's align cleanly: Sunday = 0
    let startOffset = firstDay.getDay(); // 0 is Sunday
    if (isFa) {
      // In Iranian calendar, week starts on Saturday (which has getDay() === 6)
      startOffset = (firstDay.getDay() + 1) % 7;
    }

    // Days from prev month
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevD = new Date(year, month, -i);
      days.push({
        date: prevD,
        dateKey: formatDateKey(prevD),
        isCurrentMonth: false,
        isToday: formatDateKey(prevD) === '2026-11-15'
      });
    }

    // Days of current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const currD = new Date(year, month, d, 12, 0, 0);
      days.push({
        date: currD,
        dateKey: formatDateKey(currD),
        isCurrentMonth: true,
        isToday: formatDateKey(currD) === '2026-11-15'
      });
    }

    // Pad remaining to full 35 or 42 grid
    const remaining = 35 - (days.length % 35);
    if (remaining > 0 && remaining < 35 && days.length < 35) {
      for (let j = 1; j <= remaining; j++) {
        const nextD = new Date(year, month + 1, j, 12, 0, 0);
        days.push({
          date: nextD,
          dateKey: formatDateKey(nextD),
          isCurrentMonth: false,
          isToday: formatDateKey(nextD) === '2026-11-15'
        });
      }
    } else if (days.length > 35 && days.length < 42) {
      const rem42 = 42 - days.length;
      for (let j = 1; j <= rem42; j++) {
        const nextD = new Date(year, month + 1, j, 12, 0, 0);
        days.push({
          date: nextD,
          dateKey: formatDateKey(nextD),
          isCurrentMonth: false,
          isToday: formatDateKey(nextD) === '2026-11-15'
        });
      }
    }

    return days;
  }, [selectedDate, isFa]);

  // Week days generation (7 days centered or starting from selectedDate)
  const weekDays = useMemo(() => {
    const days: { date: Date; dateKey: string; isToday: boolean }[] = [];
    const dayOfWeek = selectedDate.getDay();
    const offset = isFa ? (dayOfWeek + 1) % 7 : dayOfWeek;

    for (let i = 0; i < 7; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() - offset + i);
      days.push({
        date: d,
        dateKey: formatDateKey(d),
        isToday: formatDateKey(d) === '2026-11-15'
      });
    }
    return days;
  }, [selectedDate, isFa]);

  // Navigation handlers
  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleGoToday = () => {
    setSelectedDate(new Date('2026-11-15T12:00:00Z'));
  };

  // Weekday column headers
  const weekDayHeaders = isFa 
    ? ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {t.calendar.title}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                {t.calendar.subtitle} ({agentName})
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View mode toggle (Month / Week / Day) */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.calendar.viewMonth}
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.calendar.viewWeek}
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'day'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.calendar.viewDay}
            </button>
          </div>

          {/* Today button */}
          <button
            onClick={handleGoToday}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {t.calendar.today}
          </button>

          {/* Quick Schedule Button in Calendar */}
          {onAddTaskModalOpen && (
            <button
              onClick={() => onAddTaskModalOpen(selectedDateKey)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>{t.agentWorkspace.addTask}</span>
            </button>
          )}

          {/* Prev / Next navigation */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              title={t.calendar.prev}
            >
              <ChevronLeft className={`w-4 h-4 ${isFa ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              title={t.calendar.next}
            >
              <ChevronRight className={`w-4 h-4 ${isFa ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Calendar Explorer + Right Day Agenda Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calendar Presentation (Month, Week, or Day preview) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            {/* Calendar Current Month / Range Display */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-base md:text-lg text-slate-900 dark:text-slate-100">
                  {formatDisplayDate(selectedDate, lang, { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono" dir="ltr">
                {selectedDate.toISOString().split('T')[0]}
              </span>
            </div>

            {/* MONTH VIEW */}
            {viewMode === 'month' && (
              <div>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 dark:text-slate-500 pb-2">
                  {weekDayHeaders.map((day, idx) => (
                    <div key={idx} className="py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {monthDays.map((dayItem, idx) => {
                    const isSelected = dayItem.dateKey === selectedDateKey;
                    const dateTasks = tasksByDate.get(dayItem.dateKey) || [];
                    const pendingTasks = dateTasks.filter(tk => tk.status !== 'Completed');
                    const completedTasks = dateTasks.filter(tk => tk.status === 'Completed');
                    const dateCalls = callsByDate.get(dayItem.dateKey) || [];

                    const hasCalls = dateCalls.length > 0;

                    const dayNumber = isFa
                      ? new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric' }).format(dayItem.date)
                      : dayItem.date.getDate();

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(dayItem.date)}
                        className={`min-h-[75px] md:min-h-[85px] p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                            : dayItem.isToday
                            ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40'
                            : dayItem.isCurrentMonth
                            ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            : 'bg-transparent border-transparent opacity-30 hover:opacity-70'
                        }`}
                      >
                        {/* Day number header */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : dayItem.isToday
                                ? 'bg-amber-500 text-white'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {dayNumber}
                          </span>

                          {dayItem.isToday && (
                            <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                              {isFa ? 'امروز' : 'Today'}
                            </span>
                          )}
                        </div>

                        {/* Indicators for tasks and calls */}
                        <div className="space-y-1 mt-1">
                          {pendingTasks.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-md truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span className="truncate">
                                {pendingTasks.length} {isFa ? 'وظیفه' : 'task'}
                              </span>
                            </div>
                          )}

                          {completedTasks.length > 0 && pendingTasks.length === 0 && (
                            <div className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md truncate">
                              <CheckCircle2 className="w-2.5 h-2.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <span className="truncate">
                                {completedTasks.length} {isFa ? 'انجام شد' : 'done'}
                              </span>
                            </div>
                          )}

                          {hasCalls && (
                            <div className="flex items-center gap-1 text-[10px] font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded-md truncate">
                              <Phone className="w-2.5 h-2.5 shrink-0 text-blue-600 dark:text-blue-400" />
                              <span className="truncate">
                                {dateCalls.length} {isFa ? 'تماس' : 'call'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {viewMode === 'week' && (
              <div className="space-y-3">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((dayItem, idx) => {
                    const isSelected = dayItem.dateKey === selectedDateKey;
                    const dateTasks = tasksByDate.get(dayItem.dateKey) || [];
                    const pendingTasks = dateTasks.filter(tk => tk.status !== 'Completed');
                    const dateCalls = callsByDate.get(dayItem.dateKey) || [];

                    const dayName = isFa
                      ? new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'short' }).format(dayItem.date)
                      : dayItem.date.toLocaleDateString('en-US', { weekday: 'short' });

                    const dayNumber = isFa
                      ? new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric' }).format(dayItem.date)
                      : dayItem.date.getDate();

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(dayItem.date)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                            : dayItem.isToday
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-slate-900 dark:text-slate-100'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {dayName}
                        </span>
                        <span className="text-lg font-extrabold my-1">{dayNumber}</span>
                        <div className="flex items-center gap-1">
                          {pendingTasks.length > 0 && (
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-amber-500'}`} />
                          )}
                          {dateCalls.length > 0 && (
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">{t.calendar.viewWeek}:</span>{' '}
                  {isFa ? 'برای مشاهده جزئیات برنامه و وظایف روی هر روز هفته کلیک کنید.' : 'Click any day in this week to focus on its agenda.'}
                </div>
              </div>
            )}

            {/* DAY VIEW (Focus Day Banner) */}
            {viewMode === 'day' && (
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-slate-950 dark:to-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                  {formatDisplayDate(selectedDate, lang, { weekday: 'long' })}
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                  {formatDisplayDate(selectedDate, lang, { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-lg">
                    {selectedDateTasks.filter(t => t.status !== 'Completed').length} {t.calendar.pendingOnly}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 rounded-lg">
                    {selectedDateCalls.length} {t.calendar.callsCount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Day Agenda & Action Items for the Selected Date */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors flex flex-col h-full min-h-[500px]">
            {/* Agenda Header */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                    {t.calendar.agendaForDate}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {formatDisplayDate(selectedDate, lang, { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                    {selectedDateTasks.length} {t.calendar.tasksCount}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                    {selectedDateCalls.length} {t.calendar.callsCount}
                  </span>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['all', 'pending', 'completed', 'calls'] as const).map(f => {
                  const label = f === 'all' 
                    ? t.calendar.allTypes 
                    : f === 'pending' 
                    ? t.calendar.pendingOnly 
                    : f === 'completed' 
                    ? t.calendar.completedOnly 
                    : t.calendar.callsOnly;

                  return (
                    <button
                      key={f}
                      onClick={() => setItemFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        itemFilter === f
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agenda Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedDateTasks.length === 0 && selectedDateCalls.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 p-6">
                  <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
                  <p className="text-sm font-semibold">{t.calendar.noItemsOnDate}</p>
                </div>
              ) : (
                <>
                  {/* Task Action Items */}
                  {selectedDateTasks.map(task => {
                    const urgency = getUrgencyBadge(task.priority, lang);
                    const isDone = task.status === 'Completed';
                    const relatedCustomer = customers.find(c => c.id === task.customerId);

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                          isDone
                            ? 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                        }`}
                      >
                        {/* Header: Priority & Due time */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] px-2 py-0.5 rounded border font-bold ${urgency.className}`}>
                              {urgency.label}
                            </span>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              {task.deadline || formatDisplayTime(task.dueTime, lang)}
                            </span>
                          </div>

                          <button
                            onClick={() => onUpdateTaskStatus(task.id, isDone ? 'Pending' : 'Completed')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              isDone
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{isDone ? t.calendar.markPending : t.calendar.markDone}</span>
                          </button>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className={`text-sm md:text-base font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* Customer association */}
                        {relatedCustomer && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{task.customerName}</span>
                            </div>
                            <span className="font-mono text-slate-600 dark:text-slate-400" dir="ltr">
                              {relatedCustomer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Calls Handled on this Date */}
                  {selectedDateCalls.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        {t.calendar.callsHandledOnDate} ({selectedDateCalls.length})
                      </span>

                      {selectedDateCalls.map(c => (
                        <div
                          key={c.id}
                          className="p-3.5 bg-blue-50/40 dark:bg-slate-950/60 rounded-xl border border-blue-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {c.customerName}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono" dir="ltr">
                                {formatDuration(c.durationSec)}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 italic line-clamp-2">
                              "{c.analysis?.brief || '...'}"
                            </p>
                          </div>

                          <span className="text-[11px] font-mono text-slate-500 shrink-0" dir="ltr">
                            {formatDisplayTime(c.startTime, lang)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
