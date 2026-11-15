import React, { useState } from 'react';
import { CallRecord, Staff, Customer, FollowUpTask, AdminRubric } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  CartesianGrid
} from 'recharts';
import { 
  PhoneCall, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldAlert,
  Zap,
  Target,
  Headphones,
  Activity,
  Sparkles,
  ChevronRight,
  PieChart as PieChartIcon
} from 'lucide-react';
import { formatDuration, getSentimentBadge, getUrgencyBadge } from '../lib/utils';
import { Language } from '../lib/i18n';

interface AdminDashboardViewProps {
  calls: CallRecord[];
  staffList: Staff[];
  customers: Customer[];
  tasks: FollowUpTask[];
  rubrics: AdminRubric[];
  onSelectCall: (callId: string) => void;
  onSelectCustomer: (customerId: string) => void;
  onSelectStaff: (staffId: string) => void;
  onNavigateTab: (tab: any) => void;
  lang: Language;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  calls,
  staffList,
  customers,
  tasks,
  rubrics,
  onSelectCall,
  onSelectCustomer,
  onSelectStaff,
  onNavigateTab,
  lang
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const isRtl = lang === 'fa';

  // --- Aggregate Metrics ---
  const totalCallsCount = calls.length;
  const totalDurationSec = calls.reduce((acc, c) => acc + (c.durationSec || 0), 0);
  const avgDurationSec = totalCallsCount > 0 ? Math.round(totalDurationSec / totalCallsCount) : 0;

  // Average Staff Quality Score
  const staffScores = calls
    .map(c => c.analysis?.overallStaffScore)
    .filter((s): s is number => typeof s === 'number');
  const avgStaffScore = staffScores.length > 0 
    ? Math.round((staffScores.reduce((a, b) => a + b, 0) / staffScores.length) * 10) / 10 
    : 0;

  // Average Customer Purchase Willingness
  const purchaseScores = calls
    .map(c => c.analysis?.customerPurchaseWillingness)
    .filter((s): s is number => typeof s === 'number');
  const avgPurchaseWillingness = purchaseScores.length > 0 
    ? Math.round(purchaseScores.reduce((a, b) => a + b, 0) / purchaseScores.length) 
    : 0;

  // Churn Risk & Critical Accounts
  const highChurnCustomers = customers.filter(c => (c.evaluation?.churnRiskScore || 0) >= 30);
  const highIntentCustomers = customers.filter(c => (c.evaluation?.purchasePropensityScore || c.purchaseWillingness || 0) >= 80);
  
  // Pending Tasks Breakdown
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const criticalTasks = pendingTasks.filter(t => t.priority === 'Critical' || t.priority === 'High');

  // --- Chart 1: Sentiment Distribution ---
  const sentimentCounts: Record<string, number> = {
    'Very Positive': 0,
    'Positive': 0,
    'Neutral': 0,
    'Skeptical': 0,
    'Frustrated': 0
  };
  calls.forEach(c => {
    const s = c.analysis?.detectedSentiment;
    if (s && sentimentCounts[s] !== undefined) {
      sentimentCounts[s]++;
    } else {
      sentimentCounts['Neutral']++;
    }
  });

  const SENTIMENT_COLORS = {
    'Very Positive': '#10B981', // emerald-500
    'Positive': '#3B82F6',     // blue-500
    'Neutral': '#64748B',      // slate-500
    'Skeptical': '#F59E0B',    // amber-500
    'Frustrated': '#EF4444'    // rose-500
  };

  const sentimentChartData = Object.entries(sentimentCounts).map(([name, count]) => ({
    name: isRtl ? (
      name === 'Very Positive' ? 'بسیار مشتاق' :
      name === 'Positive' ? 'مثبت و همسو' :
      name === 'Neutral' ? 'بی‌طرف' :
      name === 'Skeptical' ? 'مردد و محتاط' : 'ناراضی / معترض'
    ) : name,
    rawName: name,
    value: count,
    color: SENTIMENT_COLORS[name as keyof typeof SENTIMENT_COLORS]
  })).filter(d => d.value > 0);

  // --- Chart 2: Hourly / Daily Call Volume & Score Trend ---
  const volumeTrendData = isRtl ? [
    { label: 'شنبه', calls: 14, score: 86, avgSec: 240 },
    { label: '۱شنبه', calls: 19, score: 89, avgSec: 280 },
    { label: '۲شنبه', calls: 24, score: 94, avgSec: 310 },
    { label: '۳شنبه', calls: 18, score: 91, avgSec: 260 },
    { label: '۴شنبه', calls: 22, score: 95, avgSec: 290 },
    { label: '۵شنبه', calls: 9, score: 92, avgSec: 180 },
    { label: 'جمعه', calls: 6, score: 96, avgSec: 150 },
  ] : [
    { label: 'Mon', calls: 14, score: 86, avgSec: 240 },
    { label: 'Tue', calls: 19, score: 89, avgSec: 280 },
    { label: 'Wed', calls: 24, score: 94, avgSec: 310 },
    { label: 'Thu', calls: 18, score: 91, avgSec: 260 },
    { label: 'Fri', calls: 22, score: 95, avgSec: 290 },
    { label: 'Sat', calls: 9, score: 92, avgSec: 180 },
    { label: 'Sun', calls: 6, score: 96, avgSec: 150 },
  ];

  // --- Chart 3: Customer Effort Tier Breakdown ---
  const tierCounts = { T1: 0, T2: 0, T3: 0 };
  customers.forEach(c => {
    if (c.effortTier in tierCounts) {
      tierCounts[c.effortTier as keyof typeof tierCounts]++;
    }
  });

  const tierChartData = [
    { name: isRtl ? 'سطح T1 (اولویت ویژه/سازمانی)' : 'Tier 1 (High Touch)', value: tierCounts.T1, color: '#3B82F6' },
    { name: isRtl ? 'سطح T2 (پیگیری استاندارد)' : 'Tier 2 (Standard)', value: tierCounts.T2, color: '#10B981' },
    { name: isRtl ? 'سطح T3 (هدایت خودکار/سلف‌سرویس)' : 'Tier 3 (Self-Serve)', value: tierCounts.T3, color: '#94A3B8' },
  ];

  // --- Staff Leaderboard Calculation ---
  const staffLeaderboard = staffList.map(agent => {
    const agentCalls = calls.filter(c => c.staffId === agent.id);
    const agentScores = agentCalls
      .map(c => c.analysis?.overallStaffScore)
      .filter((s): s is number => typeof s === 'number');
    const calculatedAvgScore = agentScores.length > 0
      ? Math.round(agentScores.reduce((a, b) => a + b, 0) / agentScores.length)
      : agent.avgScore;
    
    const agentPendingTasks = tasks.filter(t => t.assignedStaffId === agent.id && t.status !== 'Completed');

    return {
      ...agent,
      callsCount: agentCalls.length,
      currentScore: calculatedAvgScore,
      pendingTasksCount: agentPendingTasks.length
    };
  }).sort((a, b) => b.currentScore - a.currentScore);

  // --- Rubric Breakdown from Rubrics & Calls ---
  const rubricStats = rubrics.map(rubric => {
    const scores: number[] = [];
    calls.forEach(c => {
      const match = c.analysis?.staffPerformanceScores?.find(s => s.name === rubric.name || s.criterionId === rubric.id);
      if (match) scores.push(match.score);
    });
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 88;
    return {
      ...rubric,
      avgScore
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {isRtl ? 'داشبورد جامع نظارت مدیر' : 'Executive Overview'}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isRtl ? 'تحلیل در لحظه مکالمات ویپ' : 'Live Speechmatics & LLM Stream'}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {isRtl ? 'مرکز فرماندهی و پایش هوشمند تماس‌ها' : 'VoIP Intelligence & Operations Command'}
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isRtl 
              ? 'پایش لحظه‌ای کیفیت پاسخگویی اپراتورها، تمایل به خرید مشتریان، نرخ حفظ و ریزش و پیگیری وظایف استخراج‌شده از مکالمات.'
              : 'Holistic real-time visibility into staff performance, customer conversion propensity, churn alarms, and auto-generated VoIP action items.'}
          </p>
        </div>

        {/* Quick Filter Switcher */}
        <div className="relative z-10 flex items-center gap-2 bg-slate-800/80 backdrop-blur p-1 rounded-xl border border-slate-700/60 self-start lg:self-center">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'today'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {isRtl ? 'امروز' : 'Today'}
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'week'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {isRtl ? '۷ روز اخیر' : 'Past 7 Days'}
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'month'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {isRtl ? 'ماه جاری' : 'This Month'}
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Staff Performance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isRtl ? 'میانگین کیفیت کارشناسان' : 'Avg Staff Quality Score'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {avgStaffScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{isRtl ? '۴.۲٪ بهبود نسبت به دوره قبل' : '+4.2% vs previous period'}</span>
          </div>
        </div>

        {/* KPI 2: Total Calls & AHT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isRtl ? 'کل تماس‌های پردازش‌شده' : 'Total Calls Processed'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {totalCallsCount}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400" dir="ltr">
              AHT: {formatDuration(avgDurationSec)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? '۱۰۰٪ پیاده‌سازی خودکار و تحلیل' : '100% speech-to-text scored'}</span>
          </div>
        </div>

        {/* KPI 3: High Purchase Propensity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isRtl ? 'مشتریان پرپتانسیل (قصد خرید بالا)' : 'High Purchase Intent'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {highIntentCustomers.length}
            </span>
            <span className="text-xs text-slate-400">
              {isRtl ? `از ${customers.length} مشتری` : `of ${customers.length} accounts`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isRtl ? `میانگین تمایل: ${avgPurchaseWillingness}٪` : `Avg Willingness: ${avgPurchaseWillingness}%`}</span>
          </div>
        </div>

        {/* KPI 4: Churn & Urgent Follow-ups */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isRtl ? 'هشدارهای فوری و خطر ریزش' : 'Churn Alarms & Critical Tasks'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
              {criticalTasks.length}
            </span>
            <span className="text-xs text-slate-400">
              {isRtl ? 'وظیفه بحرانی باز' : 'urgent tasks open'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isRtl ? `${highChurnCustomers.length} مشتری در معرض ریزش` : `${highChurnCustomers.length} accounts at churn risk`}</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Call Load & Quality Trends + Customer Effort Tiers + Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isRtl ? 'روند هفتگی حجم مکالمات و کیفیت پاسخگویی' : 'Weekly Call Volume & Quality Score Trend'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl ? 'همبستگی میان تعداد تماس‌های روزانه و امتیاز کیفیت عملکرد کارشناسان' : 'Correlation between daily call volume and staff rubric evaluation'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>{isRtl ? 'تعداد تماس' : 'Calls'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>{isRtl ? 'امتیاز کیفیت' : 'Score'}</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[70, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: '1px solid #334155', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Area yAxisId="left" type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#callsGrad)" name={isRtl ? 'تماس‌ها' : 'Calls'} />
                <Area yAxisId="right" type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" name={isRtl ? 'امتیاز' : 'Quality'} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution Pie (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? 'طیف لحن و حس مشتریان' : 'Customer Sentiment Distribution'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRtl ? 'تحلیل آوایی و متنی Speechmatics' : 'Acoustic & transcript analysis'}
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: '1px solid #334155', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {sentimentChartData.map(item => (
              <div key={item.rawName} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {item.value} {isRtl ? 'تماس' : 'calls'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Effort Allocation & Matrix Quick-view */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-500" />
              <span>{isRtl ? 'تفکیک مشتریان بر اساس سطوح اولویت و ارزش (Effort Allocation Tiers)' : 'Customer Effort Allocation & Account Tiers'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRtl ? 'تخصیص هوشمند توان کارشناسان به سرنخ‌های با بازدهی بالا بر اساس تحلیل خودکار مکالمات' : 'Data-driven resource allocation based on propensity scoring'}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('customers')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1"
          >
            <span>{isRtl ? 'ماتریس کامل مشتریان' : 'Full Customer Matrix'}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tierChartData.map(t => (
            <div 
              key={t.name}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">{t.name}</span>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  {t.value} {isRtl ? 'سازمان / حساب' : 'accounts'}
                </span>
              </div>
              <div className="w-3.5 h-12 rounded-full" style={{ backgroundColor: t.color }} />
            </div>
          ))}
        </div>
      </div>

      {/* Second Row: Staff Leaderboard & Criteria Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Quality Leaderboard (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Headphones className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isRtl ? 'رتبه‌بندی عملکرد کارشناسان مرکز تماس' : 'Agent Performance Leaderboard'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl ? 'بر اساس امتیازات استخراج‌شده از صوت مکالمات، زمان مکالمه و پیگیری‌ها' : 'Evaluated against admin scoring rubrics and task follow-through'}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('staff')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1"
            >
              <span>{isRtl ? 'تحلیل تفصیلی کارشناسان' : 'Detailed Analytics'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">
                  <th className="pb-3 text-inherit">{isRtl ? 'کارشناس' : 'Agent'}</th>
                  <th className="pb-3 text-inherit">{isRtl ? 'تیم / دپارتمان' : 'Department'}</th>
                  <th className="pb-3 text-inherit">{isRtl ? 'تماس‌های پردازش‌شده' : 'Calls'}</th>
                  <th className="pb-3 text-inherit">{isRtl ? 'میانگین زمان مکالمه' : 'Avg AHT'}</th>
                  <th className="pb-3 text-inherit">{isRtl ? 'امتیاز کیفیت' : 'Quality Score'}</th>
                  <th className="pb-3 text-inherit text-right">{isRtl ? 'اقدام' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {staffLeaderboard.map((agent, idx) => (
                  <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                          idx === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <img src={agent.avatar} alt={agent.name} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">{agent.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Ext: {agent.extension}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{agent.department}</td>
                    <td className="py-3 font-mono font-semibold text-slate-800 dark:text-slate-200">{agent.callsCount}</td>
                    <td className="py-3 font-mono text-slate-500 dark:text-slate-400" dir="ltr">{formatDuration(agent.avgHandleTimeSec)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${agent.currentScore >= 90 ? 'bg-emerald-500' : agent.currentScore >= 75 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${agent.currentScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {agent.currentScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          onSelectStaff(agent.id);
                          onNavigateTab('staff');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors"
                      >
                        {isRtl ? 'مشاهده' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rubrics Performance (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{isRtl ? 'پایش شاخص‌های ارزیابی مدیر' : 'Rubrics Performance'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl ? 'میانگین نمره کارشناسان در هر شاخص' : 'Average score across evaluation rubrics'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('rules')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1"
            >
              <span>{isRtl ? 'تنظیمات' : 'Rules'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="space-y-3.5">
            {rubricStats.map(r => (
              <div key={r.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                    {r.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{isRtl ? `وزن ${r.weight}٪` : `Weight ${r.weight}%`}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {r.avgScore} / 100
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${r.avgScore >= 90 ? 'bg-emerald-500' : r.avgScore >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    style={{ width: `${r.avgScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Recent Calls & High Priority Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent VoIP Sessions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isRtl ? 'آخرین نشست‌های صوتی و ارزیابی‌ها' : 'Recent VoIP Call Sessions'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl ? 'تماس‌های تازه‌ای که پیاده‌سازی و نمره‌گذاری شده‌اند' : 'Latest transcribed and analyzed interactions'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('calls')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1"
            >
              <span>{isRtl ? 'مشاهده همه' : 'View All'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="space-y-2.5">
            {calls.slice(0, 4).map(call => {
              const staff = staffList.find(s => s.id === call.staffId);
              const sentimentBadge = getSentimentBadge(call.analysis?.detectedSentiment, lang);

              return (
                <div 
                  key={call.id}
                  onClick={() => {
                    onSelectCall(call.id);
                    onNavigateTab('explorer');
                  }}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {call.direction === 'inbound' ? 'IN' : 'OUT'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{call.customerName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${sentimentBadge.bg}`}>
                          {sentimentBadge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isRtl ? `پاسخگو: ${staff?.name || 'کارشناس'}` : `Agent: ${staff?.name || 'Agent'}`} • <span dir="ltr">{formatDuration(call.durationSec)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 block">
                      {call.analysis?.overallStaffScore.toFixed(0)} / 100
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                      {isRtl ? `${call.analysis?.customerPurchaseWillingness}٪ خرید` : `${call.analysis?.customerPurchaseWillingness}% intent`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Tasks & Urgent Follow-ups */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{isRtl ? 'اقدامات فوری استخراج‌شده از مکالمات' : 'Urgent Auto-Extracted Follow-ups'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl ? 'وظایف دارای اولویت بالا با مهلت نزدیک' : 'High priority callbacks and action deadlines'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1"
            >
              <span>{isRtl ? 'مدیریت وظایف' : 'Task Queue'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.slice(0, 4).map(task => {
              const urgencyBadge = getUrgencyBadge(task.priority, lang);

              return (
                <div 
                  key={task.id}
                  onClick={() => {
                    if (task.customerId) {
                      onSelectCustomer(task.customerId);
                    }
                  }}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${urgencyBadge.className}`}>
                        {urgencyBadge.label}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{task.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span>{isRtl ? `مشتری: ${task.customerName}` : `Cust: ${task.customerName}`}</span>
                      <span>•</span>
                      <span>{isRtl ? `مسئول: ${task.staffName}` : `Staff: ${task.staffName}`}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
                    {task.deadline}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
