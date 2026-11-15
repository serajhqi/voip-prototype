import React, { useState } from 'react';
import { Staff, CallRecord } from '../types';
import { Award, Clock, PhoneCall, CheckCircle2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatDuration, getSentimentBadge } from '../lib/utils';
import { Language, translations } from '../lib/i18n';

interface StaffAnalyticsViewProps {
  staffList: Staff[];
  calls: CallRecord[];
  onSelectCall: (callId: string) => void;
  lang: Language;
}

export const StaffAnalyticsView: React.FC<StaffAnalyticsViewProps> = ({
  staffList,
  calls,
  onSelectCall,
  lang
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Overall'>('Weekly');
  const t = translations[lang];
  const isRtl = lang === 'fa';

  const currentStaff = staffList.find(s => s.id === selectedStaffId) || staffList[0];
  const staffCalls = calls.filter(c => c.staffId === currentStaff?.id);

  const performanceTrendData = [
    { day: isRtl ? 'شنبه' : 'Mon', score: 86, calls: 14 },
    { day: isRtl ? '۱شنبه' : 'Tue', score: 89, calls: 18 },
    { day: isRtl ? '۲شنبه' : 'Wed', score: 94, calls: 22 },
    { day: isRtl ? '۳شنبه' : 'Thu', score: 91, calls: 16 },
    { day: isRtl ? '۴شنبه' : 'Fri', score: 95, calls: 19 },
    { day: isRtl ? '۵شنبه' : 'Sat', score: 92, calls: 8 },
    { day: isRtl ? 'جمعه' : 'Sun', score: 96, calls: 5 },
  ];

  if (!currentStaff) return null;

  return (
    <div className="space-y-6">
      {/* Top Controls: Staff Selector & Timeframe */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <img
            src={currentStaff.avatar}
            alt={currentStaff.name}
            className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentStaff.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {t.screenPop.ext}: {currentStaff.extension}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentStaff.department}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Staff Switcher */}
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
          >
            {staffList.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.department})
              </option>
            ))}
          </select>

          {/* Timeframe Filter */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            {(['Daily', 'Weekly', 'Monthly', 'Overall'] as const).map(tf => {
              const label = tf === 'Daily' ? t.staffAnalytics.daily : tf === 'Weekly' ? t.staffAnalytics.weekly : tf === 'Monthly' ? t.staffAnalytics.monthly : t.staffAnalytics.overall;
              return (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    timeframe === tf
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
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-[11px] uppercase font-semibold">{t.staffAnalytics.qualityScore}</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mb-0.5">{currentStaff.avgScore} / 100</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.staffAnalytics.qualitySubtitle}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-[11px] uppercase font-semibold">{t.staffAnalytics.callsHandled}</span>
            <PhoneCall className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mb-0.5">{currentStaff.totalCallsHandled}</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.staffAnalytics.callsSubtitle}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-[11px] uppercase font-semibold">{t.staffAnalytics.avgHandleTime}</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mb-0.5">
            {formatDuration(currentStaff.avgHandleTimeSec)}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400">{t.staffAnalytics.ahtTarget}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-[11px] uppercase font-semibold">{t.staffAnalytics.taskAdherence}</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono mb-0.5">96.8%</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.staffAnalytics.adherenceSubtitle}</span>
        </div>
      </div>

      {/* Main Grid: Trend Chart & Coaching Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col h-[380px] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{t.staffAnalytics.qualityTrends}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.staffAnalytics.scoredAuto}</p>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
              {t.staffAnalytics.evalCriteria}
            </span>
          </div>

          <div className="flex-1 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#0f172a'
                  }}
                  wrapperClassName="dark:!bg-slate-950 dark:!border-slate-800 dark:!text-slate-100"
                />
                <Bar dataKey="score" name="Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Coaching */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-2.5">
              {t.staffAnalytics.strengths}
            </h3>
            <ul className="space-y-1.5">
              {currentStaff.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-2.5">
              {t.staffAnalytics.coachingRecommendations}
            </h3>
            <ul className="space-y-1.5">
              {currentStaff.coachingPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              {t.staffAnalytics.activeBadges}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentStaff.tags.map(tag => (
                <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Handled Calls Drilldown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
          {t.staffAnalytics.callsHandledBy} {currentStaff.name}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 uppercase text-slate-400 dark:text-slate-500 font-semibold">
                <th className="pb-2.5 text-inherit">{t.callsList.customerHeader}</th>
                <th className="pb-2.5 text-inherit">{t.staffAnalytics.direction}</th>
                <th className="pb-2.5 text-inherit">{t.staffAnalytics.duration}</th>
                <th className="pb-2.5 text-inherit">{t.callDetails.sentiment}</th>
                <th className="pb-2.5 text-inherit">{t.callDetails.staffScore}</th>
                <th className="pb-2.5 text-inherit text-right">{t.staffAnalytics.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {staffCalls.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 text-slate-900 dark:text-slate-200">
                    <span className="font-medium block">{c.customerName}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono" dir="ltr">{c.customerPhone}</span>
                  </td>
                  <td className="py-2.5">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {c.direction === 'inbound' ? t.callDetails.inbound : t.callDetails.outbound}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400 font-mono" dir="ltr">{formatDuration(c.durationSec)}</td>
                  <td className="py-2.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded border ${getSentimentBadge(c.analysis?.detectedSentiment, lang).bg}`}>
                      {getSentimentBadge(c.analysis?.detectedSentiment, lang).label}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {c.analysis?.overallStaffScore.toFixed(1) || 'N/A'}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onSelectCall(c.id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      {t.staffAnalytics.analyzeCall} <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
