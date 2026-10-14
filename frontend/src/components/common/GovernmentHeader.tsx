import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, BookmarkCheck, Globe, CheckSquare } from 'lucide-react';
import { Language } from '../../types';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  fontSize: 'sm' | 'base' | 'lg';
  onFontSizeChange: (size: 'sm' | 'base' | 'lg') => void;
  savedTasksCount: number;
  onOpenTasks: () => void;
}

export const GovernmentHeader: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  fontSize,
  onFontSizeChange,
  savedTasksCount,
  onOpenTasks
}) => {
  const { t } = useTranslation();

  return (
    <header className="w-full bg-gov-navy text-white text-xs select-none">
      {/* Indian National Tricolor Ribbon */}
      <div className="tricolor-bar w-full" />

      {/* Official Government of India Top Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        {/* Left: Official Emblem & Ministry Branding */}
        <div className="flex items-center gap-2.5">
          {/* Emblem Icon */}
          <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center font-bold text-amber-300 text-xs">
            🏛️
          </div>
          <div>
            <div className="font-semibold tracking-wide text-amber-300 flex items-center gap-1.5">
              <span>भारत सरकार</span>
              <span className="text-white/40">|</span>
              <span>Government of India</span>
            </div>
            <div className="text-[10px] text-slate-300 hidden sm:block">
              National Public Services & Citizen Grievance Assistance Portal
            </div>
          </div>
        </div>

        {/* Right: Accessibility Controls, Language, Emergency & Tasks */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 ml-auto">
          {/* Font Size Accessibility Adjuster */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15 text-[11px]">
            <span className="text-slate-300 mr-1 hidden md:inline">Font:</span>
            <button
              onClick={() => onFontSizeChange('sm')}
              className={`px-1 rounded hover:bg-white/20 transition ${fontSize === 'sm' ? 'bg-amber-400 text-gov-navy font-bold' : 'text-slate-200'}`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => onFontSizeChange('base')}
              className={`px-1 rounded hover:bg-white/20 transition ${fontSize === 'base' ? 'bg-amber-400 text-gov-navy font-bold' : 'text-slate-200'}`}
              title="Standard text"
            >
              A
            </button>
            <button
              onClick={() => onFontSizeChange('lg')}
              className={`px-1 rounded hover:bg-white/20 transition ${fontSize === 'lg' ? 'bg-amber-400 text-gov-navy font-bold' : 'text-slate-200'}`}
              title="Large text"
            >
              A+
            </button>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded border border-white/15">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="text-slate-900 bg-white">English</option>
              <option value="hi" className="text-slate-900 bg-white">हिन्दी (Hindi)</option>
              <option value="mr" className="text-slate-900 bg-white">मराठी (Marathi)</option>
              <option value="hinglish" className="text-slate-900 bg-white">Hinglish (हिंग्लिश)</option>
            </select>
          </div>

          {/* Saved Tasks & Checklists Button */}
          <button
            onClick={onOpenTasks}
            className="flex items-center gap-1.5 bg-emerald-600/80 hover:bg-emerald-600 px-2.5 py-1 rounded font-medium text-white transition border border-emerald-400/40 relative"
            title="View saved schemes, drafts, and document checklists"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('nav_tasks')}</span>
            {savedTasksCount > 0 && (
              <span className="bg-amber-400 text-gov-navy text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedTasksCount}
              </span>
            )}
          </button>

          {/* Emergency 112 Tap-to-Call Pill */}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-full shadow-sm hover:shadow transition border border-red-400/50 text-xs animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>112 Emergency</span>
          </a>
        </div>
      </div>
    </header>
  );
};
