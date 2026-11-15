import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, ChevronRight, History, Calendar, ChevronDown, ChevronUp, ExternalLink, MessageSquare } from 'lucide-react';
import { CallRecord, FollowUpTask, Customer } from '../types';
import { formatDuration, getSentimentBadge, getUrgencyBadge } from '../lib/utils';
import { Language, translations } from '../lib/i18n';

interface CallDetailsViewProps {
  call: CallRecord;
  calls?: CallRecord[];
  customers?: Customer[];
  onSelectCall?: (callId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: FollowUpTask['status']) => void;
  onSelectCustomer?: (customerId: string) => void;
  lang: Language;
  isAgentView?: boolean;
}

export const CallDetailsView: React.FC<CallDetailsViewProps> = ({
  call,
  calls = [],
  customers = [],
  onSelectCall,
  onUpdateTaskStatus,
  onSelectCustomer,
  lang,
  isAgentView = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [expandedHistoryCallId, setExpandedHistoryCallId] = useState<string | null>(null);
  const totalDuration = call.durationSec || 60;
  const t = translations[lang];
  const isRtl = lang === 'fa';

  // Customer historical records (including other calls and current call)
  const customerCalls = calls.filter(c => c.customerId === call.customerId);
  const customerProfile = customers.find(c => c.id === call.customerId);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const restart = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const sentiment = getSentimentBadge(call.analysis?.detectedSentiment, lang);

  return (
    <div className="space-y-6">
      {/* Header bar with call metadata */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {call.direction === 'inbound' ? t.callDetails.inbound : t.callDetails.outbound}
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500 font-mono" dir="ltr">ID: {call.id}</span>
              <span className="text-sm text-slate-300 dark:text-slate-600">•</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-mono" dir="ltr">{new Date(call.startTime).toLocaleString()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <span>{call.customerName}</span>
              <button
                onClick={() => onSelectCustomer && onSelectCustomer(call.customerId)}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {t.callDetails.viewProfile} <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono" dir="ltr">Caller ID: {call.customerPhone}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {call.analysis && (
              <>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-center transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.callDetails.sentiment}</span>
                  <span className={`text-sm font-bold px-2.5 py-0.5 rounded border inline-block mt-1 ${sentiment.bg}`}>
                    {sentiment.label}
                  </span>
                </div>

                {/* Staff Score is hidden when agent views the call, so they are blind to performance scoring */}
                {!isAgentView && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-center transition-colors">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.callDetails.staffScore}</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono inline-block mt-0.5">
                      {call.analysis.overallStaffScore.toFixed(1)} / 100
                    </span>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-center transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.callDetails.purchaseIntent}</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono inline-block mt-0.5">
                    {call.analysis.customerPurchaseWillingness}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Audio Waveform Player */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <Volume2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              {t.callDetails.audioSyncTitle}
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm" dir="ltr">
              {formatDuration(currentTime)} / {formatDuration(totalDuration)}
            </span>
          </div>

          {/* Clean enterprise waveform */}
          <div 
            className="relative h-16 bg-slate-100 dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden cursor-pointer transition-colors"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = isRtl ? (rect.right - e.clientX) : (e.clientX - rect.left);
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              setCurrentTime(Math.floor(ratio * totalDuration));
            }}
          >
            {Array.from({ length: 65 }).map((_, i) => {
              const progress = (currentTime / totalDuration) * 65;
              const isPassed = i <= progress;
              const heightPct = Math.sin(i * 0.45) * 30 + Math.cos(i * 0.75) * 20 + 45;
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-sm transition-all duration-100 ${
                    isPassed 
                      ? 'bg-blue-600 dark:bg-blue-500' 
                      : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                  style={{ height: `${Math.max(15, Math.min(95, heightPct))}%` }}
                />
              );
            })}
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className={`w-4 h-4 ${isRtl ? 'rotate-180' : 'ml-0.5'}`} />}
              </button>
              <button
                onClick={restart}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {isPlaying ? t.callDetails.playing : t.callDetails.paused}
              </span>
            </div>

            <div className="flex items-center gap-5 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
                <span>{t.callDetails.staff}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>{t.callDetails.customer}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Transcript + Intelligence/Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Diarized Transcript Feed */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[750px] transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Speechmatics Diarized Transcript</h3>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              {call.diarizedTurns.length} {t.callDetails.speakerTurns}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {call.diarizedTurns.map((turn, idx) => {
              const isStaff = turn.speaker === 'Staff';
              const turnSentiment = getSentimentBadge(turn.sentiment, lang);
              const isCurrentlyPlaying = currentTime >= turn.startTime && currentTime <= turn.endTime;

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'} transition-all ${
                    isCurrentlyPlaying ? 'opacity-100' : 'opacity-90'
                  }`}
                  onClick={() => setCurrentTime(turn.startTime)}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className={`text-sm font-bold ${isStaff ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {isStaff ? t.callDetails.callCenterAgent : call.customerName}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono" dir="ltr">
                      {formatDuration(turn.startTime)}
                    </span>
                    {turn.sentiment && (
                      <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${turnSentiment.bg}`}>
                        {turnSentiment.label}
                      </span>
                    )}
                  </div>

                  <div className={`p-4 rounded-2xl max-w-[85%] text-sm md:text-base leading-relaxed cursor-pointer transition-colors ${
                    isCurrentlyPlaying 
                      ? 'ring-2 ring-blue-500' 
                      : ''
                  } ${
                    isStaff
                      ? 'bg-blue-50 text-blue-950 border border-blue-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
                      : 'bg-slate-50 text-slate-900 border border-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800'
                  }`}>
                    {turn.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: LLM Intelligence, Scoring & Action Items */}
        <div className="lg:col-span-5 space-y-5">
          {/* Executive Call Brief */}
          {call.analysis && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider mb-2.5">
                {t.callDetails.aiExecutiveBrief}
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {call.analysis.brief}
              </p>

              <div className="space-y-2 pt-3.5 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t.callDetails.keyHighlights}
                </span>
                <ul className="space-y-2">
                  {call.analysis.keyPoints.map((point, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Staff Rubric Performance Scoring (ONLY VISIBLE TO ADMIN / SUPERVISOR) */}
          {!isAgentView && call.analysis && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                  {t.callDetails.staffEvalBreakdown}
                </h3>
                <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-md">
                  {call.analysis.overallStaffScore.toFixed(1)} / 100
                </span>
              </div>

              <div className="space-y-3">
                {call.analysis.staffPerformanceScores.map((scoreItem) => (
                  <div key={scoreItem.criterionId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{scoreItem.name}</span>
                      <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">{scoreItem.score} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                        style={{ width: `${scoreItem.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">{scoreItem.feedback}</p>
                  </div>
                ))}
              </div>

              {call.analysis.coachingNotes && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    {t.callDetails.supervisorCoaching}
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">{call.analysis.coachingNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Generated Follow-up Tasks */}
          {call.tasksCreated && call.tasksCreated.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                  {t.callDetails.automatedNextActions}
                </h3>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20">
                  {call.tasksCreated.length} {t.callDetails.extracted}
                </span>
              </div>

              <div className="space-y-3">
                {call.tasksCreated.map((task) => {
                  const urgencyBadge = getUrgencyBadge(task.priority, lang);
                  const isDone = task.status === 'Completed';

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {task.title}
                        </h4>
                        <span className={`text-xs px-2.5 py-0.5 rounded border font-bold ${urgencyBadge.className}`}>
                          {urgencyBadge.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{task.description}</p>

                      <div className="flex items-center justify-between text-sm pt-2.5 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-amber-600 dark:text-amber-400 text-xs font-bold">
                          {t.callDetails.deadline}: {task.deadline}
                        </span>

                        {onUpdateTaskStatus && (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, isDone ? 'Pending' : 'Completed')}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                          >
                            {isDone ? t.callDetails.completed : t.callDetails.markDone}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Call History & Longitudinal Context Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {t.callDetails.customerCallHistory}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {t.callDetails.customerCallHistorySub}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 font-mono">
                  {customerCalls.length} {isRtl ? 'تماس کل' : 'total'}
                </span>
                {customerProfile && onSelectCustomer && (
                  <button
                    onClick={() => onSelectCustomer(call.customerId)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title={t.callDetails.viewProfile}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Customer Relationship Summary Banner */}
            {customerProfile && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{customerProfile.company || customerProfile.name}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{customerProfile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400">
                    {isRtl ? 'اولویت:' : 'Tier:'} <strong className="text-slate-800 dark:text-slate-200 font-mono">{customerProfile.effortTier}</strong>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {isRtl ? 'تمایل خرید:' : 'Willingness:'} <strong className="text-blue-600 dark:text-blue-400 font-mono">{customerProfile.purchaseWillingness}%</strong>
                  </span>
                </div>
              </div>
            )}

            {/* History timeline list */}
            <div className="space-y-3">
              {customerCalls.length > 0 ? (
                customerCalls.map((histCall) => {
                  const isCurrent = histCall.id === call.id;
                  const histSentiment = getSentimentBadge(histCall.analysis?.detectedSentiment, lang);
                  const isExpanded = expandedHistoryCallId === histCall.id;

                  return (
                    <div
                      key={histCall.id}
                      className={`rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 ring-1 ring-blue-400/50 dark:ring-blue-500/30'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(histCall.startTime).toLocaleDateString()}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]" dir="ltr">
                              {formatDuration(histCall.durationSec)}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${histSentiment.bg}`}>
                              {histSentiment.label}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
                                {t.callDetails.currentCall}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {histCall.diarizedTurns && histCall.diarizedTurns.length > 0 && (
                              <button
                                onClick={() => setExpandedHistoryCallId(isExpanded ? null : histCall.id)}
                                className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                                title={isExpanded ? 'Collapse excerpt' : 'Preview dialogue'}
                              >
                                <MessageSquare className="w-3 h-3" />
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            )}

                            {!isCurrent && onSelectCall && (
                              <button
                                onClick={() => onSelectCall(histCall.id)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <span>{t.callDetails.viewOtherCall}</span>
                                <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Brief summary from analysis */}
                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                          "{histCall.analysis?.brief || '...'}"
                        </p>

                        {/* Additional metrics chips if present */}
                        {histCall.analysis && (
                          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400">
                              {t.callDetails.purchaseIntent}: <strong className="text-blue-600 dark:text-blue-400 font-mono">{histCall.analysis.customerPurchaseWillingness}%</strong>
                            </span>
                            {!isAgentView && (
                              <>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-slate-500 dark:text-slate-400">
                                  {t.callDetails.staffScore}: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{histCall.analysis.overallStaffScore.toFixed(1)}</strong>
                                </span>
                              </>
                            )}
                            {histCall.analysis.customerNeedsIdentified && histCall.analysis.customerNeedsIdentified.length > 0 && (
                              <>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                  {histCall.analysis.customerNeedsIdentified[0]}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Expandable Dialogue Excerpt */}
                      {isExpanded && histCall.diarizedTurns && (
                        <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 space-y-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            {isRtl ? 'گزیده مکالمه دیالوگ‌های ثبت‌شده:' : 'Dialogue Turn Excerpt:'}
                          </span>
                          {histCall.diarizedTurns.slice(0, 3).map((turn, tIdx) => (
                            <div
                              key={tIdx}
                              className={`p-2 rounded-lg text-xs leading-relaxed ${
                                turn.speaker === 'Staff'
                                  ? 'bg-blue-50/70 dark:bg-blue-950/30 text-slate-800 dark:text-slate-200'
                                  : 'bg-emerald-50/70 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <span className="font-bold block text-[11px] mb-0.5 text-slate-600 dark:text-slate-400">
                                {turn.speaker === 'Staff' ? (isRtl ? 'کارشناس:' : 'Staff:') : (isRtl ? 'مشتری:' : 'Customer:')}
                              </span>
                              <span>{turn.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 italic">
                  {t.callDetails.noPreviousCalls}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
