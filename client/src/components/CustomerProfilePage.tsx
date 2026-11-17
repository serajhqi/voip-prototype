import React, { useState } from 'react';
import { Customer, CallRecord, FollowUpTask } from '../types';
import { 
  Building, 
  Phone, 
  Mail, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  Calendar, 
  MessageSquare, 
  ListTodo, 
  Volume2,
  Sparkles,
  CheckCircle2,
  Clock,
  Check,
  Star,
  Activity,
  FileText,
  Plus
} from 'lucide-react';
import { formatTimeAgo, formatDuration, getSentimentBadge, getUrgencyBadge } from '../lib/utils';
import { Language, translations } from '../lib/i18n';
import { AddTaskModal } from './AddTaskModal';

interface CustomerProfilePageProps {
  customer: Customer;
  calls: CallRecord[];
  tasks: FollowUpTask[];
  onBack: () => void;
  onSelectCall: (callId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: FollowUpTask['status']) => void;
  onTaskCreated?: (newTask: FollowUpTask) => void;
  lang: Language;
}

export const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({
  customer,
  calls,
  tasks,
  onBack,
  onSelectCall,
  onUpdateTaskStatus,
  onTaskCreated,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'evaluation' | 'tasks' | 'notes'>('timeline');
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const t = translations[lang];
  const isRtl = lang === 'fa';

  // Customer specific items
  const customerCalls = calls.filter(c => c.customerId === customer.id);
  const customerTasks = tasks.filter(t => t.customerId === customer.id);
  const pendingTasks = customerTasks.filter(t => t.status !== 'Completed');

  // Customer Evaluation (use attached evaluation or synthesize fallback)
  const evalData = customer.evaluation || {
    customerId: customer.id,
    evaluatedAt: customer.lastCallDate || new Date().toISOString(),
    lastCallId: customerCalls[0]?.id,
    overallHealthScore: Math.min(100, Math.max(40, Math.round(customer.purchaseWillingness * 0.95))),
    purchasePropensityScore: customer.purchaseWillingness,
    churnRiskScore: customer.tags.includes('خطر-ریزش-مشتری') ? 78 : Math.max(8, 100 - customer.purchaseWillingness),
    urgencyLevel: (customer.effortTier === 'T1' ? 'High' : 'Medium') as 'Low' | 'Medium' | 'High' | 'Critical',
    budgetReadiness: (customer.tags.includes('بودجه-تاییدشده') ? 'Budget Approved' : 'Evaluating Alternatives') as any,
    satisfactionRating: customer.purchaseWillingness > 80 ? 5 : customer.purchaseWillingness > 60 ? 4 : 3,
    needsAssessment: {
      coreNeeds: customer.needs || [],
      technicalBlockers: [],
      unmetExpectations: []
    },
    metrics: [
      { id: 'm1', name: 'Product / Solution Fit', score: 85, weight: 30, level: 'High' as const, analysis: isRtl ? 'نیازهای مشتری با پلتفرم همخوانی دارد.' : 'Requirements align closely with solution capabilities.' },
      { id: 'm2', name: 'Budget Readiness & Authority', score: customer.purchaseWillingness, weight: 25, level: 'Medium' as const, analysis: isRtl ? 'در حال بررسی مدل پرداخت و هماهنگی مالی.' : 'Evaluating pricing structure and procurement.' },
      { id: 'm3', name: 'Decision Velocity', score: 75, weight: 25, level: 'Medium' as const, analysis: isRtl ? 'بازه تصمیم‌گیری کوتاه‌مدت.' : 'Short-term decision-making timeline.' },
      { id: 'm4', name: 'Engagement Consistency', score: 80, weight: 20, level: 'High' as const, analysis: isRtl ? 'پاسخگویی و ارتباط منظم.' : 'Consistent interaction frequency.' }
    ],
    behavioralSignals: {
      sentimentTrend: 'Stable' as const,
      engagementFrequency: 'Regular' as const,
      competitorMentioned: undefined,
      decisionTimeline: isRtl ? 'ظرف چند هفته آینده' : 'Within the next few weeks'
    },
    recommendedNextActions: isRtl 
      ? ['ارسال پیش‌فاکتور رسمی و پروپوزال فنی', 'تنظیم تماس هماهنگی و پیگیری جلسه دمو']
      : ['Send official proposal and technical specs', 'Schedule follow-up demo callback'],
    aiExecutiveSummary: isRtl
      ? `ارزیابی جامع مشتری بر اساس سوابق تماس و تعاملات: تمایل خرید ${customer.purchaseWillingness}%، اولویت ${customer.effortTier} و نیازهای شناسایی‌شده در مکالمات.`
      : `Customer AI synthesis from VoIP interactions: purchase propensity ${customer.purchaseWillingness}%, tier ${customer.effortTier}, with identified conversational needs.`
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Back Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title={isRtl ? 'بازگشت' : 'Back'}
          >
            {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
                {isRtl ? 'صفحه اختصاصی پرونده مشتری' : 'Standalone Customer Profile'}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {customer.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {customer.name}
            </h1>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs md:text-sm font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'ثبت پیگیری / اقدام جدید' : 'New Task / Callback'}</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card: 360 Customer Identity & Key Metrics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Identity & Contact Details */}
          <div className="lg:col-span-5 space-y-3 pb-6 lg:pb-0 lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-slate-200 dark:border-slate-800 lg:pl-6 rtl:lg:pl-0 rtl:lg:pr-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{customer.name}</h2>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mt-1">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{customer.company || (isRtl ? 'حقیقی / بدون سازمان' : 'Independent')}</span>
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 shadow-sm">
                Tier {customer.effortTier}
              </span>
            </div>

            <div className="space-y-2 pt-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono font-semibold" dir="ltr">{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono text-xs">{customer.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{isRtl ? 'آخرین تماس ثبت‌شده:' : 'Last Call:'} {formatTimeAgo(customer.lastCallDate, lang)}</span>
              </div>
            </div>

            {/* Tags preview */}
            {customer.tags && customer.tags.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {customer.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Core Telephony & AI Metrics Bar */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Purchase Propensity */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">
                {isRtl ? 'تمایل به خرید' : 'Purchase Intent'}
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {customer.purchaseWillingness}%
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${customer.purchaseWillingness}%` }} />
              </div>
            </div>

            {/* Account Health Score */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">
                {isRtl ? 'امتیاز سلامت رابطه' : 'Health Score'}
              </span>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {evalData.overallHealthScore}%
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {evalData.overallHealthScore >= 80 ? (isRtl ? 'روابط عالی' : 'Optimal') : (isRtl ? 'متوسط' : 'Moderate')}
              </span>
            </div>

            {/* Total Calls */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">
                {isRtl ? 'کل تماس‌های ضبط‌شده' : 'Calls Handled'}
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {customerCalls.length}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {isRtl ? 'مرجع صوت تماس' : 'Audio recordings'}
              </span>
            </div>

            {/* Open Tasks */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">
                {isRtl ? 'پیگیری‌های باز' : 'Pending Tasks'}
              </span>
              <div className={`text-2xl font-extrabold font-mono ${pendingTasks.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                {pendingTasks.length}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {pendingTasks.length > 0 ? (isRtl ? 'نیازمند اقدام' : 'Action needed') : (isRtl ? 'به‌روز است' : 'Up to date')}
              </span>
            </div>
          </div>
        </div>

        {/* AI Executive Summary Callout */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-500/30">
          <div className="flex items-center gap-2 mb-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{isRtl ? 'خلاصه تحلیلی هوش مصنوعی از وضعیت مشتری' : 'AI Behavioral Executive Brief'}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "{evalData.aiExecutiveSummary}"
          </p>
        </div>
      </div>

      {/* Tabs navigation for deep customer views */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'timeline'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isRtl ? 'تاریخچه تماس‌ها و صوت‌های ضبط‌شده' : 'Calls & Audio Timeline'}</span>
          <span className="px-2 py-0.5 rounded-full font-mono text-[11px] bg-blue-700 text-white">
            {customerCalls.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'evaluation'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>{isRtl ? 'ماتریس و سنجش هوشمند رفتار (AI)' : 'AI Intelligence & Scoring'}</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ListTodo className="w-4 h-4 text-amber-500" />
          <span>{isRtl ? 'پیگیری‌ها و اقدامات مشتری' : 'Tasks & Scheduled Actions'}</span>
          <span className="px-2 py-0.5 rounded-full font-mono text-[11px] bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            {customerTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-500" />
          <span>{isRtl ? 'نیازها، یادداشت‌ها و برچسب‌ها' : 'Needs & Internal Notes'}</span>
        </button>
      </div>

      {/* TAB 1: CALL TIMELINE & AUDIO RECORDS */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {isRtl ? `خط زمانی مکالمات تلفنی با ${customer.name}` : `VoIP Call History for ${customer.name}`}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isRtl ? 'منبع حقیقت سامانه: کلیه مکالمات ثبت‌شده' : 'Single Source of Truth: All recorded calls'}
            </span>
          </div>

          {customerCalls.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
              <Volume2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>{isRtl ? 'هیچ تماسی برای این مشتری در سامانه ضبط نشده است.' : 'No calls recorded for this customer yet.'}</p>
            </div>
          ) : (
            customerCalls.map(call => {
              const sentiment = getSentimentBadge(call.analysis?.detectedSentiment, lang);
              const isExpanded = expandedCallId === call.id;

              return (
                <div
                  key={call.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(call.startTime).toLocaleString()}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-slate-600 dark:text-slate-400 font-mono font-semibold" dir="ltr">
                        {formatDuration(call.durationSec)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${sentiment.bg}`}>
                        {sentiment.label}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="font-mono text-slate-500">ID: {call.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedCallId(isExpanded ? null : call.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isExpanded ? (isRtl ? 'بستن دیالوگ' : 'Close Transcript') : (isRtl ? 'مشاهده دیالوگ' : 'View Dialogue')}</span>
                      </button>

                      <button
                        onClick={() => onSelectCall(call.id)}
                        className="text-xs font-bold px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تحلیل صوت و امواج' : 'Audio Player'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Call Brief Summary */}
                  <div className="pt-3">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      "{call.analysis?.brief || '...'}"
                    </p>
                  </div>

                  {/* Expanded Diarized Turns */}
                  {isExpanded && call.diarizedTurns && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isRtl ? 'متن کامل مکالمه با تفکیک گوینده (Speechmatics):' : 'Speechmatics Diarized Transcript:'}
                      </span>
                      {call.diarizedTurns.map((turn, tIdx) => (
                        <div
                          key={tIdx}
                          className={`p-3 rounded-xl text-xs md:text-sm leading-relaxed ${
                            turn.speaker === 'Staff'
                              ? 'bg-blue-50/70 dark:bg-blue-950/25 text-slate-800 dark:text-slate-200'
                              : 'bg-emerald-50/70 dark:bg-emerald-950/25 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span className="font-bold block mb-1">
                            {turn.speaker === 'Staff' ? (isRtl ? 'کارشناس:' : 'Agent:') : (isRtl ? 'مشتری:' : 'Customer:')}
                          </span>
                          <span>{turn.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: AI EVALUATION & INTELLIGENCE */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          {/* 4 Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.customerEvaluations.healthScore}
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {evalData.overallHealthScore}%
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Overall Relationship</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.customerEvaluations.purchasePropensity}
              </span>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {evalData.purchasePropensityScore}%
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Intent to Convert</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.customerEvaluations.churnRisk}
              </span>
              <div className={`text-2xl font-extrabold font-mono ${evalData.churnRiskScore > 30 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {evalData.churnRiskScore}%
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Attrition Probability</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.customerEvaluations.satisfaction}
              </span>
              <div className="flex items-center gap-1 mt-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < evalData.satisfactionRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} 
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono font-bold">
                {evalData.satisfactionRating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Evaluated Metrics Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
              {t.customerEvaluations.evaluationMetrics}
            </h3>

            <div className="space-y-3">
              {evalData.metrics.map(metric => (
                <div key={metric.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{metric.name}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{metric.score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all" 
                      style={{ width: `${metric.score}%` }} 
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {metric.analysis}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommended Next Actions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
              {t.customerEvaluations.recommendedActions}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evalData.recommendedNextActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TASKS & ACTION ITEMS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {isRtl ? 'وظایف پیگیری و اقدامات برنامه‌ریزی‌شده' : 'Tasks & Scheduled Actions'} ({customerTasks.length})
            </h3>

            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'افزودن اقدام' : 'Add Action'}</span>
            </button>
          </div>

          {customerTasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
              <ListTodo className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>{isRtl ? 'هیچ اقدام یا پیگیری برای این مشتری ثبت نشده است.' : 'No follow-up tasks on record for this customer.'}</p>
            </div>
          ) : (
            customerTasks.map(task => {
              const urgency = getUrgencyBadge(task.priority, lang);
              const isDone = task.status === 'Completed';

              return (
                <div
                  key={task.id}
                  className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDone ? 'opacity-70 bg-slate-50/50 dark:bg-slate-950/40' : ''
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${urgency.className}`}>
                        {urgency.label}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>
                        {task.status}
                      </span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {task.deadline}
                      </span>
                    </div>

                    <h4 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {task.description}
                    </p>
                    <div className="text-xs text-slate-500 font-mono">
                      <span>{isRtl ? 'کارشناس مسئول:' : 'Assigned Staff:'} {task.staffName}</span>
                    </div>
                  </div>

                  {onUpdateTaskStatus && (
                    <div className="shrink-0 self-end md:self-center">
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, isDone ? 'Pending' : 'Completed')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm ${
                          isDone
                            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{isDone ? (isRtl ? 'بازگشت به حالت اقدام' : 'Mark Pending') : (isRtl ? 'انجام شد' : 'Complete')}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: NEEDS, NOTES & TAGS */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identified Needs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{isRtl ? 'نیازها و خواسته‌های استخراج‌شده مشتری' : 'Customer Identified Needs'}</span>
            </h3>

            <div className="space-y-2">
              {customer.needs && customer.needs.length > 0 ? (
                customer.needs.map((need, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{need}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">{isRtl ? 'نیاز خاصی ثبت نشده است.' : 'No specific needs recorded.'}</p>
              )}
            </div>
          </div>

          {/* CRM Internal Notes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>{isRtl ? 'یادداشت‌های داخلی پرونده' : 'Internal Notes & Context'}</span>
            </h3>

            {customer.notes ? (
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                "{customer.notes}"
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">{isRtl ? 'هیچ یادداشتی ثبت نشده است.' : 'No internal notes added.'}</p>
            )}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskCreated={(newTask) => {
          if (onTaskCreated) {
            onTaskCreated(newTask);
          }
        }}
        staffList={[]}
        selectedStaffId=""
        customers={[customer]}
        lang={lang}
      />
    </div>
  );
};
