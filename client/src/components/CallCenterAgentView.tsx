import React, { useState } from 'react';
import { Staff, FollowUpTask, Customer, CallRecord } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Phone, 
  Building, 
  Check, 
  Search, 
  ListTodo, 
  History, 
  Users2,
  UserPlus,
  MessageSquare,
  Calendar,
  Volume2,
  CalendarPlus,
  AlertTriangle
} from 'lucide-react';
import { formatDuration, getUrgencyBadge, getSentimentBadge } from '../lib/utils';
import { Language, translations } from '../lib/i18n';
import { AddCustomerModal } from './AddCustomerModal';
import { AddTaskModal } from './AddTaskModal';
import { AgentCalendarView } from './AgentCalendarView';

interface CallCenterAgentViewProps {
  staffList: Staff[];
  tasks: FollowUpTask[];
  customers: Customer[];
  calls: CallRecord[];
  onUpdateTaskStatus: (taskId: string, status: FollowUpTask['status']) => void;
  onCustomerAdded?: (newCustomer: Customer) => void;
  onTaskCreated?: (newTask: FollowUpTask) => void;
  onSelectCall?: (callId: string) => void;
  onSelectCustomer?: (customerId: string) => void;
  lang: Language;
}

type AgentTab = 'ahead' | 'calendar' | 'done' | 'customers' | 'history';

export const CallCenterAgentView: React.FC<CallCenterAgentViewProps> = ({
  staffList,
  tasks,
  customers,
  calls,
  onUpdateTaskStatus,
  onCustomerAdded,
  onTaskCreated,
  onSelectCall,
  onSelectCustomer,
  lang
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [activeTab, setActiveTab] = useState<AgentTab>('ahead');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'critical' | 'high'>('all');

  const t = translations[lang];
  const isRtl = lang === 'fa';

  const currentAgent = staffList.find(s => s.id === selectedStaffId) || staffList[0];

  // Filter tasks for this agent
  const agentTasks = tasks.filter(task => task.assignedStaffId === currentAgent?.id);
  const tasksAhead = agentTasks.filter(task => task.status !== 'Completed');
  const tasksDone = agentTasks.filter(task => task.status === 'Completed');

  // Priority-based filtered tasks ahead
  const filteredTasksAhead = tasksAhead.filter(task => {
    if (taskFilter === 'critical') return task.priority === 'Critical';
    if (taskFilter === 'high') return task.priority === 'High' || task.priority === 'Critical';
    return true;
  });

  // Filter calls for this agent
  const agentCalls = calls.filter(call => call.staffId === currentAgent?.id);

  // Filter customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.company.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || filteredCustomers[0];
  const activeCustomerCalls = calls.filter(c => c.customerId === activeCustomer?.id);
  const activeCustomerTasks = tasks.filter(t => t.customerId === activeCustomer?.id);

  if (!currentAgent) return null;

  return (
    <div className="space-y-6">
      {/* Agent Header & Operational Profile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div className="flex items-center gap-4">
          <img
            src={currentAgent.avatar}
            alt={currentAgent.name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/20">
                {t.agentWorkspace.activeAgent}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{currentAgent.name}</h1>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-mono">
                {t.screenPop.ext}: {currentAgent.extension}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {currentAgent.department}
            </p>
          </div>
        </div>

        {/* Action Controls & Agent Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Schedule Task Button */}
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>{t.agentWorkspace.addTask}</span>
          </button>

          {/* Quick Add Customer button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.agentWorkspace.addCustomer}</span>
          </button>

          {/* Agent Switcher */}
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
          >
            {staffList.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Tasks Ahead */}
        <div 
          onClick={() => setActiveTab('ahead')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'ahead'
              ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40 shadow-sm ring-1 ring-amber-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-wider">{t.agentWorkspace.statOpenTasks}</span>
            <ListTodo className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mb-1">
            {tasksAhead.length}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.agentWorkspace.todayFocus}</span>
        </div>

        {/* Calendar View KPI */}
        <div 
          onClick={() => setActiveTab('calendar')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-400 dark:border-blue-500/40 shadow-sm ring-1 ring-blue-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-wider">{t.calendar.viewMonth} & {t.calendar.today}</span>
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mb-1">
            {agentTasks.length}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.agentWorkspace.tabCalendar}</span>
        </div>

        {/* Tasks Done So Far */}
        <div 
          onClick={() => setActiveTab('done')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'done'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 shadow-sm ring-1 ring-emerald-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-wider">{t.agentWorkspace.statCompletedTasks}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mb-1">
            {tasksDone.length}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.agentWorkspace.completedLog}</span>
        </div>

        {/* Calls Handled */}
        <div 
          onClick={() => setActiveTab('history')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-300 dark:border-purple-500/40 shadow-sm ring-1 ring-purple-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-wider">{t.agentWorkspace.statCallsHandled}</span>
            <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mb-1">
            {agentCalls.length}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.agentWorkspace.tabCallHistory}</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('ahead')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'ahead'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListTodo className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{t.agentWorkspace.tabAheadToDo}</span>
            <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              {tasksAhead.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{t.agentWorkspace.tabCalendar}</span>
          </button>

          <button
            onClick={() => setActiveTab('done')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'done'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.agentWorkspace.tabDoneSoFar}</span>
            <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              {tasksDone.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'customers'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{t.agentWorkspace.tabCustomers}</span>
            <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{t.agentWorkspace.tabCallHistory}</span>
            <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {agentCalls.length}
            </span>
          </button>
        </div>

        {/* Action button */}
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>{t.agentWorkspace.addTask}</span>
        </button>
      </div>

      {/* 1. Ahead to Do (Tasks & Callbacks) */}
      {activeTab === 'ahead' && (
        <div className="space-y-4">
          {/* Quick filter & status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                {isRtl ? 'فیلتر بر اساس اولویت:' : 'Filter Priority:'}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    taskFilter === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isRtl ? 'همه اولویت‌ها' : 'All'} ({tasksAhead.length})
                </button>
                <button
                  onClick={() => setTaskFilter('high')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    taskFilter === 'high'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {isRtl ? 'فوری و بالا' : 'High & Critical'} ({tasksAhead.filter(t => t.priority === 'High' || t.priority === 'Critical').length})
                </button>
                <button
                  onClick={() => setTaskFilter('critical')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    taskFilter === 'critical'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                  }`}
                >
                  {isRtl ? 'فقط بحرانی' : 'Critical Only'} ({tasksAhead.filter(t => t.priority === 'Critical').length})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isRtl ? 'مشاهده در تقویم کاری' : 'View on Calendar'}</span>
              </button>
            </div>
          </div>

          {filteredTasksAhead.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{t.agentWorkspace.noTasksAhead}</p>
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{t.agentWorkspace.addTask}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {filteredTasksAhead.map(task => {
                const urgency = getUrgencyBadge(task.priority, lang);
                const relatedCustomer = customers.find(c => c.id === task.customerId);

                return (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`text-xs px-2.5 py-1 rounded-md border font-bold ${urgency.className}`}>
                          {urgency.label} {t.taskScheduler.priority}
                        </span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono">
                          <Clock className="w-4 h-4" />
                          {task.deadline}
                        </span>
                        {task.priority === 'Critical' && (
                          <span className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'اقدام فوری' : 'Urgent'}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {task.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                        {task.description}
                      </p>

                      {relatedCustomer && (
                        <div className="pt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <button
                            onClick={() => {
                              setSelectedCustomerId(relatedCustomer.id);
                              setActiveTab('customers');
                            }}
                            className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            <span>{relatedCustomer.company || relatedCustomer.name}</span>
                          </button>
                          <span>•</span>
                          <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                            <span>{task.customerName}</span>
                          </div>
                          <span>•</span>
                          <div className="font-mono text-slate-700 dark:text-slate-300" dir="ltr">
                            {relatedCustomer.phone}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 lg:pl-6 rtl:lg:pl-0 rtl:lg:pr-6">
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'Completed')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{t.taskScheduler.complete}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Calendar View */}
      {activeTab === 'calendar' && (
        <AgentCalendarView
          agentName={currentAgent.name}
          tasks={agentTasks}
          calls={agentCalls}
          customers={customers}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onSelectCustomer={(custId) => {
            setSelectedCustomerId(custId);
            setActiveTab('customers');
          }}
          onAddTaskModalOpen={() => setIsAddTaskModalOpen(true)}
          lang={lang}
        />
      )}

      {/* 3. Done So Far */}
      {activeTab === 'done' && (
        <div className="space-y-4">
          {tasksDone.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <p className="text-base font-semibold">{t.agentWorkspace.noTasksDone}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 uppercase text-slate-400 dark:text-slate-500 font-bold text-xs tracking-wider">
                      <th className="pb-3.5 text-inherit">Task / Action</th>
                      <th className="pb-3.5 text-inherit">{t.taskScheduler.customerLabel}</th>
                      <th className="pb-3.5 text-inherit">{t.taskScheduler.priority}</th>
                      <th className="pb-3.5 text-inherit">Target Deadline</th>
                      <th className="pb-3.5 text-inherit text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {tasksDone.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4">
                          <span className="font-bold text-slate-900 dark:text-slate-100 block line-through">
                            {task.title}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5 block">{task.description}</span>
                        </td>
                        <td className="py-4 text-slate-800 dark:text-slate-200 font-medium">
                          {task.customerName}
                        </td>
                        <td className="py-4">
                          <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${getUrgencyBadge(task.priority, lang).className}`}>
                            {getUrgencyBadge(task.priority, lang).label}
                          </span>
                        </td>
                        <td className="py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                          {task.deadline}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, 'Pending')}
                            className="px-3.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold"
                          >
                            {t.taskScheduler.markPending}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Customer Dossier & Full Call History for One Customer */}
      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Customer Selection Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-[750px] transition-colors">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3.5 py-2 rounded-xl text-base">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.agentWorkspace.searchCustomer}
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-xs md:text-sm w-full"
                />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                title={t.customerMatrix.addCustomer}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.customerMatrix.addCustomer}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredCustomers.map(customer => {
                const isSelected = customer.id === activeCustomer?.id;
                const callsCount = calls.filter(c => c.customerId === customer.id).length;

                return (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 dark:bg-slate-800 dark:border-blue-500/50 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {customer.name}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        Tier {customer.effortTier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {customer.company || (isRtl ? 'حقیقی / بدون سازمان' : 'Independent')}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span dir="ltr">{customer.phone}</span>
                      <span className="font-sans font-semibold text-blue-600 dark:text-blue-400">
                        {callsCount} {isRtl ? 'تماس' : 'calls'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer History & Deep Details */}
          <div className="lg:col-span-7 space-y-5">
            {activeCustomer ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
                <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{activeCustomer.name}</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 font-bold">
                        {activeCustomer.id}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      {activeCustomer.company || (isRtl ? 'حقیقی / بدون سازمان' : 'Independent')}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2 font-mono" dir="ltr">
                      <span>{activeCustomer.phone}</span>
                      {activeCustomer.email && (
                        <>
                          <span>•</span>
                          <span>{activeCustomer.email}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold block">{t.screenPop.purchaseWillingness}</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {activeCustomer.purchaseWillingness}%
                      </span>
                    </div>

                    {onSelectCustomer && (
                      <button
                        onClick={() => onSelectCustomer(activeCustomer.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <span>{isRtl ? 'مشاهده صفحه اختصاصی' : 'Open Dedicated Page'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Needs */}
                {activeCustomer.needs && activeCustomer.needs.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                      {t.agentWorkspace.customerNeeds}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeCustomer.needs.map((need, idx) => (
                        <span key={idx} className="text-sm bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-lg font-medium">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {activeCustomer.notes && (
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      {t.agentWorkspace.customerNotes}
                    </span>
                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                      "{activeCustomer.notes}"
                    </p>
                  </div>
                )}

                {/* Single Customer Call History Timeline */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {t.customerMatrix.callHistoryTitle} ({activeCustomerCalls.length})
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {isRtl ? 'خط زمانی تعاملات مشتری' : 'Interaction timeline'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeCustomerCalls.length > 0 ? (
                      activeCustomerCalls.map(c => {
                        const isExpanded = expandedCallId === c.id;
                        const sentiment = getSentimentBadge(c.analysis?.detectedSentiment, lang);

                        return (
                          <div
                            key={c.id}
                            className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                          >
                            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    {new Date(c.startTime).toLocaleString()}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-500 font-mono" dir="ltr">
                                    {formatDuration(c.durationSec)}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${sentiment.bg}`}>
                                    {sentiment.label}
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 italic">
                                  "{c.analysis?.brief || '...'}"
                                </p>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center">
                                <button
                                  onClick={() => setExpandedCallId(isExpanded ? null : c.id)}
                                  className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-750 transition-colors flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{isExpanded ? (isRtl ? 'بستن متن' : 'Close') : (isRtl ? 'متن مکالمه' : 'Transcript')}</span>
                                </button>

                                {onSelectCall && (
                                  <button
                                    onClick={() => onSelectCall(c.id)}
                                    className="text-xs font-bold px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex items-center gap-1 shadow-sm"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                    <span>{isRtl ? 'شنیدن صوت' : 'Audio'}</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Dialogue turns */}
                            {isExpanded && c.diarizedTurns && (
                              <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                  {isRtl ? 'دیالوگ‌های ضبط‌شده تماس' : 'Recorded Call Dialogue'}
                                </span>
                                {c.diarizedTurns.slice(0, 4).map((turn, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                                      turn.speaker === 'Staff'
                                        ? 'bg-blue-50/60 dark:bg-blue-950/20 text-slate-800 dark:text-slate-200'
                                        : 'bg-emerald-50/60 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200'
                                    }`}
                                  >
                                    <span className="font-bold block mb-0.5">
                                      {turn.speaker === 'Staff' ? (isRtl ? 'کارشناس:' : 'Agent:') : (isRtl ? 'مشتری:' : 'Customer:')}
                                    </span>
                                    <span>{turn.text}</span>
                                  </div>
                                ))}
                                {c.diarizedTurns.length > 4 && onSelectCall && (
                                  <button
                                    onClick={() => onSelectCall(c.id)}
                                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline pt-1 block"
                                  >
                                    {isRtl ? `+ ${c.diarizedTurns.length - 4} بخش دیگر مکالمه... (شنیدن و پخش کامل در جزئیات تماس)` : `+ ${c.diarizedTurns.length - 4} more turns... (open in call explorer)`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">{t.customerMatrix.noCalls}</p>
                    )}
                  </div>
                </div>

                {/* Single Customer Tasks */}
                {activeCustomerTasks.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                      {t.customerMatrix.tasksHistoryTitle} ({activeCustomerTasks.length})
                    </span>
                    <div className="space-y-2">
                      {activeCustomerTasks.map(task => (
                        <div
                          key={task.id}
                          className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className={`font-bold block ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                              {task.title}
                            </span>
                            <span className="text-slate-500 font-mono">{task.deadline}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded font-bold ${task.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 5. Call History */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {t.staffAnalytics.callsHandledBy} {currentAgent.name} ({agentCalls.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">{t.callsList.title}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 uppercase text-slate-400 dark:text-slate-500 font-bold text-xs tracking-wider">
                  <th className="pb-3 text-inherit">{t.callsList.customerHeader}</th>
                  <th className="pb-3 text-inherit">Date & Time</th>
                  <th className="pb-3 text-inherit">{t.staffAnalytics.duration}</th>
                  <th className="pb-3 text-inherit">Summary / Topic</th>
                  <th className="pb-3 text-inherit text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {agentCalls.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 text-slate-900 dark:text-slate-200">
                      <button
                        onClick={() => {
                          setSelectedCustomerId(c.customerId);
                          setActiveTab('customers');
                        }}
                        className="font-bold block hover:text-blue-600 dark:hover:text-blue-400 text-left rtl:text-right"
                      >
                        {c.customerName}
                      </button>
                      <span className="text-xs text-slate-500 font-mono" dir="ltr">{c.customerPhone}</span>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs" dir="ltr">
                      {new Date(c.startTime).toLocaleString()}
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs" dir="ltr">
                      {formatDuration(c.durationSec)}
                    </td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300 text-xs md:text-sm max-w-md line-clamp-1 italic">
                      "{c.analysis?.brief || '...'}"
                    </td>
                    <td className="py-3.5 text-right">
                      {onSelectCall && (
                        <button
                          onClick={() => onSelectCall(c.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold"
                        >
                          {isRtl ? 'شنیدن صوت' : 'Audio'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerCreated={(newCust) => {
          setSelectedCustomerId(newCust.id);
          setActiveTab('customers');
          if (onCustomerAdded) {
            onCustomerAdded(newCust);
          }
        }}
        lang={lang}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskCreated={(newTask) => {
          if (onTaskCreated) {
            onTaskCreated(newTask);
          }
        }}
        staffList={staffList}
        selectedStaffId={currentAgent.id}
        customers={customers}
        lang={lang}
      />
    </div>
  );
};
