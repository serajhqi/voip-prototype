import React, { useState } from 'react';
import { AdminRubric, AdminTagRule } from '../types';
import { Check, Edit2 } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface AdminRulesViewProps {
  rubrics: AdminRubric[];
  tagRules: AdminTagRule[];
  onUpdateRubric: (id: string, updates: Partial<AdminRubric>) => void;
  lang: Language;
}

export const AdminRulesView: React.FC<AdminRulesViewProps> = ({
  rubrics,
  tagRules,
  onUpdateRubric,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'Rubrics' | 'TagRules' | 'PromptPreview'>('Rubrics');
  const [editingRubricId, setEditingRubricId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState<number>(20);
  const t = translations[lang];

  const totalWeight = rubrics.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.adminRules.title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.adminRules.subtitle}</p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
          {(['Rubrics', 'TagRules', 'PromptPreview'] as const).map(tab => {
            const label = tab === 'Rubrics' ? t.adminRules.rubricsTab : tab === 'TagRules' ? t.adminRules.taxonomyTab : t.adminRules.promptTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === tab
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

      {/* Tab 1: Staff Rubrics */}
      {activeTab === 'Rubrics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs shadow-sm transition-colors">
            <span className="text-slate-600 dark:text-slate-400">
              {t.adminRules.totalWeight}{' '}
              <span className={`font-mono font-bold ${totalWeight === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {totalWeight}% / 100%
              </span>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {t.adminRules.weightNotice}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rubrics.map(rubric => {
              const isEditing = editingRubricId === rubric.id;

              return (
                <div
                  key={rubric.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400">
                        {rubric.category}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{rubric.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editWeight}
                            onChange={(e) => setEditWeight(Number(e.target.value))}
                            className="w-14 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs px-2 py-0.5 rounded font-mono"
                          />
                          <button
                            onClick={() => {
                              onUpdateRubric(rubric.id, { weight: editWeight });
                              setEditingRubricId(null);
                            }}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRubricId(rubric.id);
                            setEditWeight(rubric.weight);
                          }}
                          className="flex items-center gap-1 text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-750"
                        >
                          <Edit2 className="w-3 h-3" />
                          {rubric.weight}% {t.adminRules.weight}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rubric.description}</p>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">
                      {t.adminRules.expectedBehavior}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">{rubric.targetExpectation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Tagging Taxonomy Rules */}
      {activeTab === 'TagRules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tagRules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs px-2 py-0.5 rounded font-mono font-bold"
                  style={{ backgroundColor: `${rule.color}15`, color: rule.color, borderColor: `${rule.color}40`, borderWidth: '1px' }}
                >
                  #{rule.tag}
                </span>
                <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-semibold">{rule.category}</span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold mb-0.5">{t.adminRules.triggerCondition}</span>
                {rule.conditionSummary}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: LLM Prompt Preview */}
      {activeTab === 'PromptPreview' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{t.adminRules.promptTitle}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.adminRules.promptSubtitle}
          </p>

          <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed" dir="ltr">
{`{
  "system_instruction": "You are a VoIP Call Intelligence Engine. Evaluate the diarized transcript against admin criteria.",
  "active_rubrics": [
${rubrics.map(r => `    { "id": "${r.id}", "name": "${r.name}", "weight": ${r.weight}, "target": "${r.targetExpectation}" }`).join(',\n')}
  ],
  "required_outputs": [
    "brief": "Executive 3-sentence summary",
    "detected_sentiment": "Very Positive | Positive | Neutral | Skeptical | Frustrated",
    "urgency": "Low | Medium | High | Critical",
    "customer_purchase_willingness": "0-100 score",
    "customer_effort_tier": "T1 | T2 | T3",
    "staff_scores": "Per-criterion score (1-100) + feedback",
    "next_actions": [
      { "title": "...", "description": "...", "deadline": "...", "priority": "..." }
    ]
  ]
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
