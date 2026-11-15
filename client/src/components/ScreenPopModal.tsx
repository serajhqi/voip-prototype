import React from 'react';
import { Phone, PhoneOff, PhoneIncoming, Clock, User, Building, Activity, Mic } from 'lucide-react';
import { ActiveCallState, FollowUpTask, CallRecord } from '../types';
import { formatDuration, getSentimentBadge } from '../lib/utils';
import { Language, translations } from '../lib/i18n';

interface ScreenPopModalProps {
  activeCall: ActiveCallState | null;
  onAnswer: () => void;
  onEndCall: () => void;
  recentCalls: CallRecord[];
  openTasks: FollowUpTask[];
  lang: Language;
}

export const ScreenPopModal: React.FC<ScreenPopModalProps> = ({
  activeCall,
  onAnswer,
  onEndCall,
  recentCalls,
  openTasks,
  lang
}) => {
  if (!activeCall) return null;

  const t = translations[lang];
  const isRinging = activeCall.status === 'ringing';
  const isInProgress = activeCall.status === 'in_progress';
  const isAnalyzing = activeCall.status === 'analyzing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Softphone status banner */}
        <div className={`px-6 py-4 flex items-center justify-between border-b transition-colors ${
          isRinging 
            ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-500/30' 
            : isInProgress 
              ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-500/30'
              : 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center border transition-colors ${
              isRinging 
                ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' 
                : isInProgress 
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' 
                  : 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30'
            }`}>
              {isRinging ? <PhoneIncoming className="w-5 h-5 animate-pulse" /> : <Phone className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                  isRinging 
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20' 
                    : isInProgress
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
                      : 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20'
                }`}>
                  {isRinging ? t.screenPop.incomingCall : isInProgress ? t.screenPop.callInProgress : t.screenPop.speechmaticsAnalysis}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {t.screenPop.ext}: {activeCall.staff.extension} ({activeCall.staff.name})
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-1">
                {activeCall.customer.name}
                {activeCall.isNewCustomer && (
                  <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 px-2 py-0.5 rounded font-normal">
                    {t.screenPop.newLead}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isInProgress && (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded text-emerald-600 dark:text-emerald-400 font-mono text-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {formatDuration(activeCall.durationSec)}
              </div>
            )}

            {isRinging && (
              <button
                onClick={onAnswer}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {t.screenPop.answerCall}
              </button>
            )}

            {isInProgress && (
              <button
                onClick={onEndCall}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                {t.screenPop.endCall}
              </button>
            )}

            {isAnalyzing && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30 rounded-lg text-xs font-medium">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                {t.screenPop.scoringWait}
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
          {/* Left Column: Customer Intel & Needs */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
                {t.screenPop.customerIdentity}
              </h3>
              
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.screenPop.company}</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    {activeCall.customer.company}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.screenPop.callerId}</span>
                  <div className="font-mono text-slate-700 dark:text-slate-200 mt-0.5" dir="ltr">{activeCall.customer.phone}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.screenPop.email}</span>
                  <div className="text-slate-700 dark:text-slate-300 truncate mt-0.5" dir="ltr">{activeCall.customer.email}</div>
                </div>
              </div>
            </div>

            {/* Willingness & Effort Tier */}
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.screenPop.valueAndEffort}
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">{t.screenPop.purchaseWillingness}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{activeCall.customer.purchaseWillingness}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeCall.customer.purchaseWillingness}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.screenPop.effortTier}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                    Tier {activeCall.customer.effortTier}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Tags */}
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-semibold uppercase tracking-wider">
                {t.screenPop.identifiedTags}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCall.customer.tags.map(tag => (
                  <span key={tag} className="text-[11px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Middle & Right Columns: Live Transcript & Contextual Memory */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-[280px] transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
                  {t.screenPop.speechmaticsFeed}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {activeCall.activeTurns?.length || 0} {t.screenPop.turnsCaptured}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {activeCall.activeTurns && activeCall.activeTurns.length > 0 ? (
                  activeCall.activeTurns.map((turn, i) => {
                    const isStaff = turn.speaker === 'Staff';
                    const badge = getSentimentBadge(turn.sentiment, lang);
                    return (
                      <div 
                        key={i} 
                        className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'} text-xs`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`font-semibold ${isStaff ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-teal-400'}`}>
                            {isStaff ? activeCall.staff.name : activeCall.customer.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{turn.startTime}s</span>
                          {turn.sentiment && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded border ${badge.bg}`}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                          isStaff 
                            ? 'bg-blue-50 text-blue-900 border border-blue-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700' 
                            : 'bg-white text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800'
                        }`}>
                          {turn.text}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                    <Activity className="w-5 h-5 mb-2 text-slate-400" />
                    <span>{t.screenPop.waitingAudio}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Historical Context & Open Tasks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 transition-colors">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {t.screenPop.pastInteractionMemory}
                </span>
                {recentCalls.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2 italic">
                      "{recentCalls[0].analysis?.brief || '...'}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>{t.screenPop.totalCalls}: {recentCalls.length}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {t.screenPop.lastSentiment}: {getSentimentBadge(recentCalls[0].analysis?.detectedSentiment, lang).label}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">{t.screenPop.noPriorCalls}</p>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 transition-colors">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {t.screenPop.openActionItems}
                </span>
                {openTasks.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{openTasks[0].title}</div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {openTasks[0].deadline}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">{t.screenPop.noPendingTasks}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
