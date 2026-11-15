import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language } from "./i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(dateString: string, lang: Language = 'en'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (lang === 'fa') {
    if (diffInMinutes < 1) return 'هم‌اکنون';
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ساعت پیش`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} روز پیش`;
  }

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function getSentimentBadge(sentiment?: string, lang: Language = 'en') {
  const isFa = lang === 'fa';
  switch (sentiment) {
    case 'Very Positive':
      return { 
        label: isFa ? 'بسیار رضایت‌بخش' : 'Very Positive', 
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' 
      };
    case 'positive':
    case 'Positive':
      return { 
        label: isFa ? 'مثبت' : 'Positive', 
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' 
      };
    case 'Frustrated':
    case 'negative':
      return { 
        label: isFa ? 'ناراضی / شاکی' : 'Frustrated', 
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30' 
      };
    case 'Skeptical':
      return { 
        label: isFa ? 'مردد / حساس به قیمت' : 'Skeptical', 
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' 
      };
    default:
      return { 
        label: isFa ? 'عادی' : (sentiment || 'Neutral'), 
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' 
      };
  }
}

export function getUrgencyBadge(urgency: string, lang: Language = 'en') {
  const isFa = lang === 'fa';
  let label = urgency;
  let style = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';

  switch (urgency) {
    case 'Critical':
      label = isFa ? 'حیاتی' : 'Critical';
      style = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/40 font-semibold';
      break;
    case 'High':
      label = isFa ? 'فوری / بالا' : 'High';
      style = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/40 font-semibold';
      break;
    case 'Medium':
      label = isFa ? 'متوسط' : 'Medium';
      style = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 font-medium';
      break;
    default:
      label = isFa ? 'عادی' : 'Low';
      style = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      break;
  }

  return { label, className: style };
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function formatDisplayDate(dateInput: Date | string, lang: Language = 'en', options?: Intl.DateTimeFormatOptions): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  if (lang === 'fa') {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  }

  return new Intl.DateTimeFormat('en-US', options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
}

export function formatDisplayTime(dateInput: Date | string, lang: Language = 'en'): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);
}
