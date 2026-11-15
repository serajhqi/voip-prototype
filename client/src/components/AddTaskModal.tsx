import React, { useState } from 'react';
import { X, CalendarPlus, Clock, User, AlertCircle } from 'lucide-react';
import { Customer, FollowUpTask, Staff } from '../types';
import { Language, translations } from '../lib/i18n';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (newTask: FollowUpTask) => void;
  staffList: Staff[];
  selectedStaffId: string;
  customers: Customer[];
  defaultDate?: string;
  lang: Language;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  staffList: _staffList,
  selectedStaffId,
  customers,
  defaultDate,
  lang
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState<string>('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [dueTime, setDueTime] = useState<string>(() => {
    if (defaultDate) {
      return `${defaultDate}T10:00:00`;
    }
    return '2026-11-16T10:00:00';
  });
  const [deadline, setDeadline] = useState<string>('فردا ساعت ۱۰:۰۰');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[lang];
  const isRtl = lang === 'fa';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t.agentWorkspace.enterTitleError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const targetCustomer = customers.find(c => c.id === customerId);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      assignedStaffId: selectedStaffId,
      customerId: customerId || undefined,
      customerName: targetCustomer ? targetCustomer.name : undefined,
      dueTime: dueTime ? new Date(dueTime).toISOString() : new Date().toISOString(),
      deadline: deadline.trim() || 'به‌زودی',
      priority
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask: FollowUpTask = await res.json();
      onTaskCreated(createdTask);
      setTitle('');
      setDescription('');
      setCustomerId('');
      setPriority('Medium');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t.agentWorkspace.newTaskModalTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.agentWorkspace.newTaskSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              {t.agentWorkspace.taskTitle} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isRtl ? 'مثلاً: تماس پیگیری ارسال پیش‌فاکتور سرور' : 'e.g., Follow-up call for enterprise quote'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              {t.agentWorkspace.taskDescription}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRtl ? 'شرح کار، نکات کلیدی یا مواردی که باید در تماس بررسی شود...' : 'Details, key notes, or agenda for this follow-up...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              {t.agentWorkspace.selectCustomer}
            </label>
            <div className="relative">
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 appearance-none"
              >
                <option value="">-- {t.agentWorkspace.noCustomerSelected} --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''} - {c.phone}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-3 pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Priority & Deadline Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                {t.agentWorkspace.priorityLevel}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Low">{isRtl ? 'عادی / کم (Low)' : 'Low'}</option>
                <option value="Medium">{isRtl ? 'متوسط (Medium)' : 'Medium'}</option>
                <option value="High">{isRtl ? 'بالا (High)' : 'High'}</option>
                <option value="Critical">{isRtl ? 'بحرانی / فوری (Critical)' : 'Critical'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                {t.agentWorkspace.targetDeadline}
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder={isRtl ? 'مثلاً: فردا ساعت ۱۰:۰۰' : 'e.g. Tomorrow 10:00 AM'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date & Time Picker */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              {t.agentWorkspace.targetDueTime}
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
              <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-3 pointer-events-none text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              {t.customerMatrix.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>{isSubmitting ? '...' : t.agentWorkspace.saveTask}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
