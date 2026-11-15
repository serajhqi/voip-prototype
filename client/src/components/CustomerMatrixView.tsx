import React, { useState } from 'react';
import { Customer, CallRecord, FollowUpTask } from '../types';
import { 
  Building, 
  Phone, 
  Mail, 
  ChevronRight, 
  Search, 
  UserPlus, 
  Calendar, 
  MessageSquare, 
  ListTodo, 
  Volume2
} from 'lucide-react';
import { formatTimeAgo, formatDuration, getSentimentBadge, getUrgencyBadge } from '../lib/utils';
import { Language, translations } from '../lib/i18n';
import { AddCustomerModal } from './AddCustomerModal';

interface CustomerMatrixViewProps {
  customers: Customer[];
  calls: CallRecord[];
  tasks?: FollowUpTask[];
  onSelectCall: (callId: string) => void;
  selectedCustomerId?: string | null;
  onCustomerAdded?: (newCustomer: Customer) => void;
  lang: Language;
}

export const CustomerMatrixView: React.FC<CustomerMatrixViewProps> = ({
  customers,
  calls,
  tasks = [],
  onSelectCall,
  selectedCustomerId,
  onCustomerAdded,
  lang
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCustomerId, setActiveCustomerId] = useState<string>(
    selectedCustomerId || customers[0]?.id || ''
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'calls' | 'tasks'>('calls');
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);

  const t = translations[lang];
  const isRtl = lang === 'fa';

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const currentCustomer = customers.find(c => c.id === activeCustomerId) || customers[0];
  const customerCalls = calls.filter(c => c.customerId === currentCustomer?.id);
  const customerTasks = tasks.filter(t => t.customerId === currentCustomer?.id);

  const handleCustomerCreated = (newCustomer: Customer) => {
    setActiveCustomerId(newCustomer.id);
    if (onCustomerAdded) {
      onCustomerAdded(newCustomer);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{t.customerMatrix.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.customerMatrix.subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-2 rounded-xl text-sm w-full sm:w-72 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.customerMatrix.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-sm w-full"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs md:text-sm font-bold shadow-sm transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.customerMatrix.addCustomer}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Directory + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer List Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[750px] transition-colors">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-3.5">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">
              {t.customerMatrix.customerAccounts} ({filteredCustomers.length})
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">{t.customerMatrix.derivedNotice}</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredCustomers.map(customer => {
              const isSelected = customer.id === currentCustomer?.id;
              const custCallsCount = calls.filter(c => c.customerId === customer.id).length;

              return (
                <div
                  key={customer.id}
                  onClick={() => setActiveCustomerId(customer.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 dark:bg-slate-800 dark:border-blue-500/50 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{customer.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {customer.company || (isRtl ? 'حقیقی / بدون سازمان' : 'Independent')}
                      </p>
                    </div>

                    <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                      Tier {customer.effortTier}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500 dark:text-slate-400">{t.screenPop.purchaseWillingness}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{customer.purchaseWillingness}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${customer.purchaseWillingness}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {custCallsCount} {t.customerMatrix.callsRecorded}
                    </span>
                    <span>{t.customerMatrix.lastCall}: {formatTimeAgo(customer.lastCallDate, lang)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Deep Dossier & History */}
        <div className="lg:col-span-7 space-y-5">
          {currentCustomer ? (
            <>
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
                <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{currentCustomer.name}</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 font-bold">
                        {currentCustomer.id}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      {currentCustomer.company || (isRtl ? 'حقیقی / بدون سازمان' : 'Independent')}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2.5">
                      <span className="flex items-center gap-1.5 font-mono" dir="ltr">
                        <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {currentCustomer.phone}
                      </span>
                      {currentCustomer.email && (
                        <span className="flex items-center gap-1.5 font-mono" dir="ltr">
                          <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {currentCustomer.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase font-bold block">{t.customerMatrix.priorityTier}</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono">
                      Tier {currentCustomer.effortTier} - {t.customerMatrix.highTouch}
                    </span>
                  </div>
                </div>

                {/* Identified Needs */}
                <div className="py-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                    {t.customerMatrix.customerNeeds}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentCustomer.needs && currentCustomer.needs.length > 0 ? (
                      currentCustomer.needs.map((need, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-lg font-medium"
                        >
                          {need}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">نیاز خاصی ثبت نشده است</span>
                    )}
                  </div>
                </div>

                {/* System Tags */}
                <div className="py-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                    {t.customerMatrix.assignedTags}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentCustomer.tags && currentCustomer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md font-mono font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CRM Notes */}
                {currentCustomer.notes && (
                  <div className="pt-4">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      {t.customerMatrix.internalNotes}
                    </span>
                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      "{currentCustomer.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Comprehensive Interaction & Action History */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveHistoryTab('calls')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeHistoryTab === 'calls'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.customerMatrix.callHistoryTitle}</span>
                      <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-blue-700 text-white">
                        {customerCalls.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveHistoryTab('tasks')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeHistoryTab === 'tasks'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ListTodo className="w-3.5 h-3.5" />
                      <span>{t.customerMatrix.tasksHistoryTitle}</span>
                      <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {customerTasks.length}
                      </span>
                    </button>
                  </div>

                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    {t.customerMatrix.customerHistory}
                  </span>
                </div>

                {/* Sub-tab 1: Calls History with Expandable Dialogue & Audio Link */}
                {activeHistoryTab === 'calls' && (
                  <div className="space-y-3">
                    {customerCalls.length > 0 ? (
                      customerCalls.map((call) => {
                        const sentiment = getSentimentBadge(call.analysis?.detectedSentiment, lang);
                        const isExpanded = expandedCallId === call.id;

                        return (
                          <div
                            key={call.id}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all"
                          >
                            <div className="p-4">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    {new Date(call.startTime).toLocaleDateString()}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-500 font-mono" dir="ltr">
                                    {formatDuration(call.durationSec)}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${sentiment.bg}`}>
                                    {sentiment.label}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setExpandedCallId(isExpanded ? null : call.id)}
                                    className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{isExpanded ? (isRtl ? 'بستن متن' : 'Close Transcript') : (isRtl ? 'مشاهده دیالوگ' : 'View Dialogue')}</span>
                                  </button>

                                  <button
                                    onClick={() => onSelectCall(call.id)}
                                    className="text-xs font-bold px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex items-center gap-1 shadow-sm"
                                  >
                                    <span>{t.customerMatrix.viewCallDetails}</span>
                                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                                  </button>
                                </div>
                              </div>

                              <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                                "{call.analysis?.brief || '...'}"
                              </p>
                            </div>

                            {/* Expanded Transcript/Turns */}
                            {isExpanded && call.diarizedTurns && (
                              <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                  {isRtl ? 'متن مکالمه تفکیک‌شده (Speechmatics)' : 'Diarized Conversation Excerpt'}
                                </span>
                                {call.diarizedTurns.slice(0, 4).map((turn, tIdx) => (
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
                                {call.diarizedTurns.length > 4 && (
                                  <button
                                    onClick={() => onSelectCall(call.id)}
                                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline pt-1 block"
                                  >
                                    {isRtl ? `+ ${call.diarizedTurns.length - 4} بخش دیگر مکالمه... (مشاهده کامل در جزئیات تماس)` : `+ ${call.diarizedTurns.length - 4} more turns... (open in full details)`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="italic">{t.customerMatrix.noCalls}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-tab 2: Customer Tasks History */}
                {activeHistoryTab === 'tasks' && (
                  <div className="space-y-3">
                    {customerTasks.length > 0 ? (
                      customerTasks.map(task => {
                        const urgency = getUrgencyBadge(task.priority, lang);
                        const isDone = task.status === 'Completed';

                        return (
                          <div
                            key={task.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isDone
                                ? 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-75'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${urgency.className}`}>
                                  {urgency.label}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                              <span>{t.taskScheduler.assignedStaff} {task.staffName}</span>
                              <span className="text-amber-600 dark:text-amber-400 font-bold">{task.deadline}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="italic">{t.customerMatrix.noTasksForCustomer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              {t.customerMatrix.selectPrompt}
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerCreated={handleCustomerCreated}
        lang={lang}
      />
    </div>
  );
};
