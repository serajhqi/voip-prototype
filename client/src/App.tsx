import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneIncoming, 
  Headphones, 
  Users, 
  CheckSquare, 
  Sliders, 
  Volume2, 
  Radio, 
  Languages, 
  Layers, 
  Sun, 
  Moon,
  ShieldCheck,
  Award,
  Home,
  LayoutDashboard
} from 'lucide-react';
import { 
  Customer, 
  Staff, 
  CallRecord, 
  FollowUpTask, 
  AdminRubric, 
  AdminTagRule, 
  ActiveCallState, 
  SimulationPreset 
} from './types';
import { ScreenPopModal } from './components/ScreenPopModal';
import { CallDetailsView } from './components/CallDetailsView';
import { StaffAnalyticsView } from './components/StaffAnalyticsView';
import { CustomerMatrixView } from './components/CustomerMatrixView';
import { CustomerEvaluationsView } from './components/CustomerEvaluationsView';
import { TaskSchedulerView } from './components/TaskSchedulerView';
import { AdminRulesView } from './components/AdminRulesView';
import { CallCenterAgentView } from './components/CallCenterAgentView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { CustomerProfilePage } from './components/CustomerProfilePage';
import { formatDuration, getSentimentBadge } from './lib/utils';
import { Language, translations } from './lib/i18n';

type NavigationTab = 'dashboard' | 'calls' | 'explorer' | 'staff' | 'customers' | 'customer_profile' | 'evaluations' | 'tasks' | 'rules' | 'agent_workspace';
export type Theme = 'light' | 'dark';
export type UserRole = 'admin' | 'agent';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fa');
  const [theme, setTheme] = useState<Theme>('light');
  const [userRole, setUserRole] = useState<UserRole>('agent'); // Default to Call Center view
  const [currentTab, setCurrentTab] = useState<NavigationTab>('agent_workspace');
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [rubrics, setRubrics] = useState<AdminRubric[]>([]);
  const [tagRules, setTagRules] = useState<AdminTagRule[]>([]);
  const [presets, setPresets] = useState<SimulationPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState<NavigationTab>('agent_workspace');
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const t = translations[lang];
  const isRtl = lang === 'fa';

  // Synchronize document direction and language attribute
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  // Synchronize document theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize WebSocket & Data Sync
  useEffect(() => {
    fetch('/api/overview')
      .then(res => res.json())
      .then(data => {
        if (data.simulationPresets) {
          setPresets(data.simulationPresets);
          if (data.simulationPresets.length > 0) {
            setSelectedPresetId(data.simulationPresets[0].id);
          }
        }
      })
      .catch(console.error);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'INIT_SYNC':
            setActiveCall(msg.payload.activeCall);
            setCalls(msg.payload.calls || []);
            setCustomers(msg.payload.customers || []);
            setStaffList(msg.payload.staff || []);
            setTasks(msg.payload.tasks || []);
            setRubrics(msg.payload.rubrics || []);
            setTagRules(msg.payload.tagRules || []);
            if (msg.payload.calls && msg.payload.calls.length > 0 && !selectedCallId) {
              setSelectedCallId(msg.payload.calls[0].id);
            }
            break;
          case 'CALL_RINGING':
            setActiveCall(msg.payload.activeCall);
            break;
          case 'CALL_ANSWERED':
            setActiveCall(msg.payload.activeCall);
            break;
          case 'SPEECHMATICS_TURN_STREAM':
            setActiveCall(prev => {
              if (!prev) return null;
              return {
                ...prev,
                durationSec: msg.payload.durationSec,
                activeTurns: msg.payload.activeTurns
              };
            });
            break;
          case 'CALL_ENDED':
            setActiveCall(msg.payload.activeCall);
            break;
          case 'ANALYSIS_COMPLETED':
            setActiveCall(null);
            setCalls(prev => [msg.payload.callRecord, ...prev]);
            setTasks(prev => [msg.payload.newTask, ...prev]);
            if (msg.payload.isNewCustomer) {
              setCustomers(prev => [msg.payload.customer, ...prev]);
            }
            setSelectedCallId(msg.payload.callRecord.id);
            if (userRole === 'admin') {
              setCurrentTab('explorer');
            }
            break;
          case 'TASK_UPDATED':
            setTasks(prev => prev.map(item => item.id === msg.payload.id ? msg.payload : item));
            break;
          case 'TASK_CREATED':
            setTasks(prev => {
              if (prev.some(t => t.id === msg.payload.id)) return prev;
              return [msg.payload, ...prev];
            });
            break;
          case 'RUBRIC_UPDATED':
            setRubrics(prev => prev.map(item => item.id === msg.payload.id ? msg.payload : item));
            break;
          case 'RUBRIC_CREATED':
            setRubrics(prev => [...prev, msg.payload]);
            break;
          case 'CUSTOMER_CREATED':
            setCustomers(prev => {
              if (prev.some(c => c.id === msg.payload.id)) return prev;
              return [msg.payload, ...prev];
            });
            break;
        }
      } catch (err) {
        console.error('WS parse error:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [userRole, selectedCallId]);

  const handleTriggerCall = (presetId?: string) => {
    const pId = presetId || selectedPresetId || presets[0]?.id;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'TRIGGER_CALL', presetId: pId }));
    } else {
      fetch('/api/simulation/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: pId })
      });
    }
  };

  const handleAnswerCall = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ANSWER_CALL' }));
    } else {
      fetch('/api/simulation/answer', { method: 'POST' });
    }
  };

  const handleEndCall = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'END_CALL' }));
    } else {
      fetch('/api/simulation/end', { method: 'POST' });
    }
  };

  const handleUpdateTaskStatus = (taskId: string, status: FollowUpTask['status']) => {
    fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  const handleUpdateRubric = (id: string, updates: Partial<AdminRubric>) => {
    fetch(`/api/rubrics/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  };

  const handleOpenCustomerProfile = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setPreviousTab(currentTab);
    setCurrentTab('customer_profile');
  };

  const selectedCall = calls.find(c => c.id === selectedCallId) || calls[0];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col ${isRtl ? 'font-vazir' : 'font-sans'} transition-colors duration-200`}>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">{t.appTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                Speechmatics CTI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Center: Role Switcher & (Admin only) Simulation Controls */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Pill */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <button
              onClick={() => {
                setUserRole('agent');
                setCurrentTab('agent_workspace');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                userRole === 'agent'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{t.roleAgent}</span>
            </button>

            <button
              onClick={() => {
                setUserRole('admin');
                if (currentTab === 'agent_workspace') setCurrentTab('dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                userRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.roleAdmin}</span>
            </button>
          </div>

          {/* Admin Simulation Controls (Hidden in Call Center View) */}
          {userRole === 'admin' ? (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden xl:inline">
                {t.scenario}
              </span>

              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                disabled={activeCall !== null}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 max-w-[190px] transition-colors"
              >
                {presets.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleTriggerCall()}
                disabled={activeCall !== null}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                  activeCall !== null
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                }`}
              >
                <PhoneIncoming className="w-3 h-3" />
                <span>{t.simulateCall}</span>
              </button>

              {activeCall && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold" dir="ltr">
                    {activeCall.status === 'ringing' ? 'Ringing...' : formatDuration(activeCall.durationSec)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isRtl ? 'سامانه پاسخگویی فعال • تاریخچه و وظایف' : 'Agent Workstation • Ready'}</span>
            </div>
          )}
        </div>

        {/* Right: Language Switcher, Theme Switcher & Engine Status */}
        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === 'en' ? 'فارسی' : 'English'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden xl:inline">
              {isConnected ? t.systemOnline : t.connecting}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between hidden md:flex transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 px-2.5 block mb-2">
              {userRole === 'agent' ? (isRtl ? 'میز کار کارشناس' : 'Agent Views') : t.platformViews}
            </span>

            {/* In Agent Role: Show Agent Navigation */}
            {userRole === 'agent' ? (
              <>
                <button
                  onClick={() => setCurrentTab('agent_workspace')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'agent_workspace'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4" />
                    <span>{t.tabs.home}</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('customers')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'customers'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>{t.tabs.customers}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    currentTab === 'customers' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300'
                  }`}>
                    {customers.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('evaluations')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'evaluations'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>{t.tabs.evaluations}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    currentTab === 'evaluations' ? 'bg-blue-700 text-white' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                  }`}>
                    AI
                  </span>
                </button>
              </>
            ) : (
              /* In Admin Role: Full platform navigation */
              <>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t.tabs.dashboard}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    currentTab === 'dashboard' ? 'bg-blue-700 text-white' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                  }`}>
                    KPI
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('calls')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'calls'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4" />
                    <span>{t.tabs.calls}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    currentTab === 'calls' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300'
                  }`}>
                    {calls.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('explorer')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'explorer'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Volume2 className="w-4 h-4" />
                    <span>{t.tabs.explorer}</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('staff')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'staff'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Headphones className="w-4 h-4" />
                    <span>{t.tabs.staff}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    currentTab === 'staff' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300'
                  }`}>
                    {staffList.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('customers')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'customers'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>{t.tabs.customers}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    currentTab === 'customers' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300'
                  }`}>
                    {customers.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('tasks')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'tasks'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4" />
                    <span>{t.tabs.tasks}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 px-1.5 py-0.2 rounded font-semibold">
                    {tasks.filter(task => task.status === 'Pending').length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('rules')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentTab === 'rules'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4" />
                    <span>{t.tabs.rules}</span>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Single source of truth info box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 transition-colors">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.singleSourceOfTruth}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {t.singleSourceDesc}
            </p>
          </div>
        </aside>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Call Center Agent Workspace (Default for Agent View) */}
          {currentTab === 'agent_workspace' && (
            <CallCenterAgentView
              staffList={staffList}
              tasks={tasks}
              customers={customers}
              calls={calls}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onCustomerAdded={(newCust) => {
                setCustomers(prev => {
                  if (prev.some(c => c.id === newCust.id)) return prev;
                  return [newCust, ...prev];
                });
                setSelectedCustomerId(newCust.id);
              }}
              onTaskCreated={(newTask) => {
                setTasks(prev => {
                  if (prev.some(t => t.id === newTask.id)) return prev;
                  return [newTask, ...prev];
                });
              }}
              onSelectCall={(callId) => {
                setSelectedCallId(callId);
                setCurrentTab('explorer');
              }}
              onSelectCustomer={(custId) => {
                handleOpenCustomerProfile(custId);
              }}
              lang={lang}
            />
          )}

          {/* Admin Executive Dashboard */}
          {currentTab === 'dashboard' && (
            <AdminDashboardView
              calls={calls}
              staffList={staffList}
              customers={customers}
              tasks={tasks}
              rubrics={rubrics}
              onSelectCall={(callId) => {
                setSelectedCallId(callId);
                setCurrentTab('explorer');
              }}
              onSelectCustomer={(custId) => {
                handleOpenCustomerProfile(custId);
              }}
              onSelectStaff={(_staffId) => {
                setCurrentTab('staff');
              }}
              onNavigateTab={(tab) => {
                setCurrentTab(tab);
              }}
              lang={lang}
            />
          )}

          {/* View 1: Calls Table & Overview (Admin) */}
          {currentTab === 'calls' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.callsList.title}</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.callsList.subtitle}</p>
                </div>

                <button
                  onClick={() => handleTriggerCall()}
                  disabled={activeCall !== null}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium shadow-sm"
                >
                  <PhoneIncoming className="w-3.5 h-3.5" />
                  {t.callsList.triggerNext}
                </button>
              </div>

              {/* Call Records Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 uppercase text-slate-400 dark:text-slate-500 font-bold text-xs tracking-wider">
                        <th className="pb-3.5 text-inherit">{t.callsList.customerHeader}</th>
                        <th className="pb-3.5 text-inherit">{t.callsList.staffHeader}</th>
                        <th className="pb-3.5 text-inherit">{t.callsList.durationHeader}</th>
                        <th className="pb-3.5 text-inherit">{t.callsList.sentimentHeader}</th>
                        <th className="pb-3.5 text-inherit">{t.callsList.staffScoreHeader}</th>
                        <th className="pb-3.5 text-inherit">{t.callsList.purchaseIntentHeader}</th>
                        <th className="pb-3.5 text-inherit text-right">{t.callsList.actionHeader}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {calls.map(call => (
                        <tr key={call.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-4">
                            <button
                              onClick={() => handleOpenCustomerProfile(call.customerId)}
                              className="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-base block text-left rtl:text-right transition-colors"
                            >
                              {call.customerName}
                            </button>
                            <span className="text-xs text-slate-500 font-mono" dir="ltr">{call.customerPhone}</span>
                          </td>
                          <td className="py-4 text-slate-700 dark:text-slate-300 font-medium">
                            {staffList.find(s => s.id === call.staffId)?.name || 'Agent'}
                          </td>
                          <td className="py-4 font-mono text-slate-500 dark:text-slate-400 text-sm" dir="ltr">
                            {formatDuration(call.durationSec)}
                          </td>
                          <td className="py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-md border font-semibold ${getSentimentBadge(call.analysis?.detectedSentiment, lang).bg}`}>
                              {getSentimentBadge(call.analysis?.detectedSentiment, lang).label}
                            </span>
                          </td>
                          <td className="py-4 font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                            {call.analysis?.overallStaffScore.toFixed(1)} / 100
                          </td>
                          <td className="py-4 font-mono font-extrabold text-base text-blue-600 dark:text-blue-400">
                            {call.analysis?.customerPurchaseWillingness}%
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedCallId(call.id);
                                setCurrentTab('explorer');
                              }}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              {t.callsList.deepAnalysis}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Call Details Explorer */}
          {currentTab === 'explorer' && (
            selectedCall ? (
              <CallDetailsView
                call={selectedCall}
                calls={calls}
                customers={customers}
                onSelectCall={(callId) => {
                  setSelectedCallId(callId);
                }}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onSelectCustomer={(custId) => {
                  handleOpenCustomerProfile(custId);
                }}
                lang={lang}
                isAgentView={userRole === 'agent'}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No call selected.
              </div>
            )
          )}

          {/* View 3: Staff Quality Analytics */}
          {currentTab === 'staff' && (
            <StaffAnalyticsView
              staffList={staffList}
              calls={calls}
              onSelectCall={(callId) => {
                setSelectedCallId(callId);
                setCurrentTab('explorer');
              }}
              lang={lang}
            />
          )}

          {/* View 4: Customer Propensity Matrix */}
          {currentTab === 'customers' && (
            <CustomerMatrixView
              customers={customers}
              calls={calls}
              tasks={tasks}
              onSelectCall={(callId) => {
                setSelectedCallId(callId);
                setCurrentTab('explorer');
              }}
              onOpenDedicatedProfile={(custId) => {
                handleOpenCustomerProfile(custId);
              }}
              selectedCustomerId={selectedCustomerId}
              onCustomerAdded={(newCust) => {
                setCustomers(prev => {
                  if (prev.some(c => c.id === newCust.id)) return prev;
                  return [newCust, ...prev];
                });
                setSelectedCustomerId(newCust.id);
              }}
              lang={lang}
            />
          )}

          {/* View 4.5: Customer Evaluations & Intelligence */}
          {currentTab === 'evaluations' && (
            <CustomerEvaluationsView
              customers={customers}
              calls={calls}
              onSelectCall={(callId) => {
                setSelectedCallId(callId);
                setCurrentTab('explorer');
              }}
              onSelectCustomerCRM={(custId) => {
                handleOpenCustomerProfile(custId);
              }}
              lang={lang}
            />
          )}

          {/* View 5: Task Scheduler */}
          {currentTab === 'tasks' && (
            <TaskSchedulerView
              tasks={tasks}
              onUpdateStatus={handleUpdateTaskStatus}
              onSelectCall={(callId) => {
                setSelectedCallId(callId);
                setCurrentTab('explorer');
              }}
              onSelectCustomer={(custId) => {
                handleOpenCustomerProfile(custId);
              }}
              lang={lang}
            />
          )}

          {/* View: Standalone Dedicated Customer Profile Page */}
          {currentTab === 'customer_profile' && (
            (() => {
              const profileCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
              if (!profileCustomer) {
                return (
                  <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                    No customer selected.
                  </div>
                );
              }
              return (
                <CustomerProfilePage
                  customer={profileCustomer}
                  calls={calls}
                  tasks={tasks}
                  onBack={() => {
                    setCurrentTab(previousTab === 'customer_profile' ? (userRole === 'agent' ? 'agent_workspace' : 'customers') : previousTab);
                  }}
                  onSelectCall={(callId) => {
                    setSelectedCallId(callId);
                    setPreviousTab('customer_profile');
                    setCurrentTab('explorer');
                  }}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onTaskCreated={(newTask) => {
                    setTasks(prev => {
                      if (prev.some(t => t.id === newTask.id)) return prev;
                      return [newTask, ...prev];
                    });
                  }}
                  lang={lang}
                />
              );
            })()
          )}

          {/* View 6: Admin Rubrics */}
          {currentTab === 'rules' && (
            <AdminRulesView
              rubrics={rubrics}
              tagRules={tagRules}
              onUpdateRubric={handleUpdateRubric}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Screen Pop Modal (Only active in Admin mode, suppressed in Agent view as requested) */}
      {userRole === 'admin' && (
        <ScreenPopModal
          activeCall={activeCall}
          onAnswer={handleAnswerCall}
          onEndCall={handleEndCall}
          recentCalls={activeCall ? calls.filter(c => c.customerId === activeCall.customer.id) : []}
          openTasks={activeCall ? tasks.filter(task => task.customerId === activeCall.customer.id && task.status !== 'Completed') : []}
          lang={lang}
        />
      )}
    </div>
  );
};
