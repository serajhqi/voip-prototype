import React, { useState } from 'react';
import { Customer, CallRecord } from '../types';
import { 
  Building, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  Activity, 
  Star, 
  Download,
  Filter,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface CustomerEvaluationsViewProps {
  customers: Customer[];
  calls: CallRecord[];
  onSelectCall: (callId: string) => void;
  onSelectCustomerCRM?: (customerId: string) => void;
  lang: Language;
}

export const CustomerEvaluationsView: React.FC<CustomerEvaluationsViewProps> = ({
  customers,
  calls,
  onSelectCall,
  onSelectCustomerCRM,
  lang
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'HighPropensity' | 'ChurnRisk' | 'Critical'>('All');
  const [activeCustomerId, setActiveCustomerId] = useState<string>(customers[0]?.id || '');
  const [downloadNotice, setDownloadNotice] = useState(false);

  const t = translations[lang];

  // Filter customers with evaluations or compute fallback evaluation if not present
  const evaluatedCustomers = customers.map(c => {
    if (c.evaluation) return c;
    // synthesize evaluation if not directly provided
    const lastCall = calls.find(call => call.customerId === c.id);
    return {
      ...c,
      evaluation: {
        customerId: c.id,
        evaluatedAt: c.lastCallDate || new Date().toISOString(),
        lastCallId: lastCall?.id,
        overallHealthScore: Math.min(100, Math.max(40, Math.round(c.purchaseWillingness * 0.95))),
        purchasePropensityScore: c.purchaseWillingness,
        churnRiskScore: c.tags.includes('خطر-ریزش-مشتری') ? 78 : Math.max(8, 100 - c.purchaseWillingness),
        urgencyLevel: c.effortTier === 'T1' ? 'High' : 'Medium',
        budgetReadiness: c.tags.includes('بودجه-تاییدشده') ? 'Budget Approved' : 'Evaluating Alternatives',
        satisfactionRating: c.purchaseWillingness > 80 ? 5 : c.purchaseWillingness > 60 ? 4 : 3,
        needsAssessment: {
          coreNeeds: c.needs,
          technicalBlockers: [],
          unmetExpectations: []
        },
        metrics: [
          { id: 'm1', name: 'Product / Solution Fit', score: 85, weight: 30, level: 'High', analysis: 'نیازهای مشتری با پلتفرم همخوانی دارد.' },
          { id: 'm2', name: 'Budget Readiness & Authority', score: c.purchaseWillingness, weight: 25, level: 'Medium', analysis: 'در حال ارزیابی مدل‌های پرداخت و بودجه.' },
          { id: 'm3', name: 'Decision Velocity', score: 75, weight: 25, level: 'Medium', analysis: 'بازه تصمیم‌گیری کوتاه‌مدت.' },
          { id: 'm4', name: 'Engagement Consistency', score: 80, weight: 20, level: 'High', analysis: 'پاسخگویی و ارتباط منظم.' }
        ],
        behavioralSignals: {
          sentimentTrend: 'Stable' as const,
          engagementFrequency: 'Regular' as const,
          competitorMentioned: undefined as string | undefined,
          decisionTimeline: 'ظرف چند هفته آینده'
        },
        recommendedNextActions: ['ارسال مستندات تکمیلی', 'تنظیم جلسه با سرپرست فروش'],
        aiExecutiveSummary: `ارزیابی مشتری بر اساس سوابق تماس و تعاملات ثبت‌شده: تمایل خرید ${c.purchaseWillingness}% و اولویت ${c.effortTier}.`
      }
    };
  });

  const filtered = evaluatedCustomers.filter(c => {
    const evalData = c.evaluation!;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evalData.needsAssessment.coreNeeds.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (statusFilter === 'HighPropensity') {
      return evalData.purchasePropensityScore >= 80;
    }
    if (statusFilter === 'ChurnRisk') {
      return evalData.churnRiskScore >= 25;
    }
    if (statusFilter === 'Critical') {
      return evalData.urgencyLevel === 'Critical' || evalData.churnRiskScore >= 60;
    }
    return true;
  });

  const currentCustomer = filtered.find(c => c.id === activeCustomerId) || filtered[0] || evaluatedCustomers[0];
  const evalData = currentCustomer?.evaluation;

  // Aggregate KPI stats
  const totalEvaluated = evaluatedCustomers.length;
  const avgHealth = Math.round(
    evaluatedCustomers.reduce((acc, c) => acc + (c.evaluation?.overallHealthScore || 70), 0) / (totalEvaluated || 1)
  );
  const highPropensityCount = evaluatedCustomers.filter(c => (c.evaluation?.purchasePropensityScore || 0) >= 80).length;
  const churnRiskCount = evaluatedCustomers.filter(c => (c.evaluation?.churnRiskScore || 0) >= 30).length;

  const handleExport = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
              Admin / Executive View
            </span>
            <span className="text-xs font-mono text-slate-400">LLM Cognitive Evaluation Engine</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t.customerEvaluations.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            {t.customerEvaluations.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t.customerEvaluations.exportReport}</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t.customerEvaluations.reportExported}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Evaluated */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">{t.customerEvaluations.summaryStats.totalEvaluated}</span>
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
            {totalEvaluated}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            {t.customerEvaluations.lastCallNotice}
          </span>
        </div>

        {/* Average Health Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">{t.customerEvaluations.summaryStats.avgHealthScore}</span>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {avgHealth} / 100
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${avgHealth}%` }} />
          </div>
        </div>

        {/* High Purchase Intent */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'HighPropensity' ? 'All' : 'HighPropensity')}
          className={`border rounded-2xl p-5 shadow-sm transition-all cursor-pointer ${
            statusFilter === 'HighPropensity' 
              ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-400 ring-1 ring-blue-400' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">{t.customerEvaluations.summaryStats.highPropensity}</span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {highPropensityCount}
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 block">
            {Math.round((highPropensityCount / (totalEvaluated || 1)) * 100)}% of customer base
          </span>
        </div>

        {/* Churn Risk Alerts */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'ChurnRisk' ? 'All' : 'ChurnRisk')}
          className={`border rounded-2xl p-5 shadow-sm transition-all cursor-pointer ${
            statusFilter === 'ChurnRisk' 
              ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-400 ring-1 ring-rose-400' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">{t.customerEvaluations.summaryStats.churnRiskAlerts}</span>
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {churnRiskCount}
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 block">
            Immediate attention recommended
          </span>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3.5 py-2 rounded-xl text-sm w-full md:w-80 transition-colors">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.customerEvaluations.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-xs md:text-sm w-full"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'All'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.customerEvaluations.filterAll}
          </button>
          <button
            onClick={() => setStatusFilter('HighPropensity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'HighPropensity'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.customerEvaluations.filterHighPropensity}
          </button>
          <button
            onClick={() => setStatusFilter('ChurnRisk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'ChurnRisk'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.customerEvaluations.filterChurnRisk}
          </button>
          <button
            onClick={() => setStatusFilter('Critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'Critical'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.customerEvaluations.filterCritical}
          </button>
        </div>
      </div>

      {/* Main Grid: Directory of Evaluated Accounts + Deep Evaluation Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Evaluated Customers */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-[820px] transition-colors">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-3.5">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Evaluated Accounts ({filtered.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono font-medium">Ranked by Priority</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filtered.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                <Filter className="w-8 h-8 mb-2 opacity-40" />
                <p>{t.customerEvaluations.noEvaluations}</p>
              </div>
            ) : (
              filtered.map(customer => {
                const evalItem = customer.evaluation!;
                const isSelected = customer.id === currentCustomer?.id;
                const isHighRisk = evalItem.churnRiskScore >= 30;

                return (
                  <div
                    key={customer.id}
                    onClick={() => setActiveCustomerId(customer.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 dark:bg-slate-800 dark:border-blue-500/60 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{customer.name}</h4>
                          {isHighRisk && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Risk</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{customer.company}</span>
                        </p>
                      </div>

                      {/* Health Pill */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.customerEvaluations.healthScore}</span>
                        <span className={`text-xs font-mono font-extrabold ${
                          evalItem.overallHealthScore >= 80 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : evalItem.overallHealthScore >= 60 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {evalItem.overallHealthScore} / 100
                        </span>
                      </div>
                    </div>

                    {/* Propensity & Churn Dual Bar */}
                    <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">{t.customerEvaluations.purchasePropensity}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{evalItem.purchasePropensityScore}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${evalItem.purchasePropensityScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">{t.customerEvaluations.churnRisk}</span>
                          <span className={`font-mono font-bold ${evalItem.churnRiskScore > 30 ? 'text-rose-600' : 'text-slate-600 dark:text-slate-400'}`}>
                            {evalItem.churnRiskScore}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${evalItem.churnRiskScore > 30 ? 'bg-rose-500' : 'bg-slate-400'}`} 
                            style={{ width: `${evalItem.churnRiskScore}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer tags */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <span className="font-mono">{customer.totalCalls} Calls on record</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {evalItem.budgetReadiness}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Customer Evaluation View */}
        <div className="lg:col-span-7 space-y-5">
          {currentCustomer && evalData ? (
            <>
              {/* Account Card Header */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        ID: {currentCustomer.id}
                      </span>
                      <span className="text-xs font-mono text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                        {currentCustomer.phone}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{currentCustomer.name}</h2>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{currentCustomer.company}</p>
                    <p className="text-xs text-slate-500 mt-1 font-mono" dir="ltr">{currentCustomer.email}</p>
                  </div>

                  {/* Actions / Fast Links */}
                  <div className="flex flex-wrap items-center gap-2">
                    {evalData.lastCallId && (
                      <button
                        onClick={() => onSelectCall(evalData.lastCallId!)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t.customerEvaluations.viewCallTranscript}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onSelectCustomerCRM && (
                      <button
                        onClick={() => onSelectCustomerCRM(currentCustomer.id)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all"
                      >
                        CRM Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Cognitive Score Matrix Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      {t.customerEvaluations.healthScore}
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {evalData.overallHealthScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Overall Relationship</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      {t.customerEvaluations.purchasePropensity}
                    </span>
                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                      {evalData.purchasePropensityScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Intent to Convert</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      {t.customerEvaluations.churnRisk}
                    </span>
                    <div className={`text-2xl font-extrabold font-mono ${evalData.churnRiskScore > 30 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {evalData.churnRiskScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Attrition Probability</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
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

                {/* AI Executive Summary Diagnosis */}
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>{t.customerEvaluations.executiveSummary}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{evalData.aiExecutiveSummary}"
                  </p>
                </div>
              </div>

              {/* Structured Needs Assessment & Technical Obstacles */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                  {t.customerEvaluations.needsAssessment}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Core Needs */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t.customerEvaluations.coreNeeds}</span>
                    </span>
                    <ul className="space-y-1.5">
                      {evalData.needsAssessment.coreNeeds.map((need, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                          <span>{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Blockers & Unmet Expectations */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{t.customerEvaluations.technicalBlockers}</span>
                    </span>
                    {evalData.needsAssessment.technicalBlockers.length > 0 ? (
                      <ul className="space-y-1.5">
                        {evalData.needsAssessment.technicalBlockers.map((blocker, idx) => (
                          <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{blocker}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No critical technical blockers identified.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Evaluation Metrics Breakdown & Bar Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                    {t.customerEvaluations.evaluationMetrics}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{evalData.metrics.length} Evaluated Dimensions</span>
                </div>

                <div className="space-y-3 pt-2">
                  {evalData.metrics.map(metric => (
                    <div key={metric.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 dark:text-slate-200">{metric.name}</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400">{metric.score} / 100</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all" 
                          style={{ width: `${metric.score}%` }} 
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-0.5">
                        {metric.analysis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Signals & Recommended Next Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Behavioral Signals */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                    {t.customerEvaluations.behavioralSignals}
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{t.customerEvaluations.sentimentTrend}:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {evalData.behavioralSignals.sentimentTrend}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{t.customerEvaluations.engagementFrequency}:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {evalData.behavioralSignals.engagementFrequency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{t.customerEvaluations.decisionTimeline}:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {evalData.behavioralSignals.decisionTimeline}
                      </span>
                    </div>
                    {'competitorMentioned' in evalData.behavioralSignals && evalData.behavioralSignals.competitorMentioned && (
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-slate-500">{t.customerEvaluations.competitorMentioned}:</span>
                        <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                          {evalData.behavioralSignals.competitorMentioned}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Recommended Actions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                    {t.customerEvaluations.recommendedActions}
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {evalData.recommendedNextActions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Select a customer to view evaluation report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
