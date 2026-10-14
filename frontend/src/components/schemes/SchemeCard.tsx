import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Volume2,
  Calendar,
  Building2
} from 'lucide-react';
import { Scheme } from '../../types';

interface SchemeCardProps {
  scheme: Scheme;
  onCheckEligibility: (scheme: Scheme) => void;
  onViewDetails: (scheme: Scheme) => void;
  isSaved: boolean;
  onToggleSave: (scheme: Scheme) => void;
  onSpeak: (text: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  onCheckEligibility,
  onViewDetails,
  isSaved,
  onToggleSave,
  onSpeak
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Localized title & description
  const title = (currentLang === 'hi' && scheme.title_hi)
    ? scheme.title_hi
    : (currentLang === 'mr' && scheme.title_mr)
    ? scheme.title_mr
    : scheme.title;

  const description = (currentLang === 'hi' && scheme.description_hi)
    ? scheme.description_hi
    : (currentLang === 'mr' && scheme.description_mr)
    ? scheme.description_mr
    : scheme.description;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-gov hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between glass-shine group relative overflow-hidden">
      {/* Top Banner with Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Level Badge */}
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              scheme.level === 'Central'
                ? 'bg-blue-50 text-gov-navy border border-blue-200'
                : 'bg-orange-50 text-orange-800 border border-orange-200'
            }`}>
              {scheme.level === 'Central' ? '🇮🇳 Central Scheme' : `🚩 ${scheme.state} State`}
            </span>

            {/* Category Badge */}
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {scheme.category}
            </span>
          </div>

          {/* Bookmark & Speech buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSpeak(`${title}. ${description}`)}
              className="p-1.5 rounded-full text-slate-400 hover:text-gov-navy hover:bg-slate-100 transition"
              title="Listen in speech"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(scheme)}
              className={`p-1.5 rounded-full transition ${
                isSaved ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isSaved ? "Saved in tasks" : "Save scheme"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Scheme Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-gov-navy transition mb-2">
          {title}
        </h3>

        {/* Ministry / Authority */}
        {scheme.ministry && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{scheme.ministry}</span>
          </div>
        )}

        {/* Plain Language Description */}
        <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-3">
          {description}
        </p>

        {/* Key Benefits Highlight */}
        {scheme.key_benefits && scheme.key_benefits.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 space-y-1 mb-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Benefits</div>
            <div className="flex items-start gap-1.5 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{scheme.key_benefits[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Action Buttons */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[130px] sm:max-w-[180px]">{scheme.source_citation}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{scheme.last_verified_date}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onCheckEligibility(scheme)}
            className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-gov-navy hover:bg-gov-navyLight text-white shadow-sm hover:shadow transition text-center"
          >
            {t('btn_check_eligibility')}
          </button>
          <button
            onClick={() => onViewDetails(scheme)}
            className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition text-center"
          >
            {t('btn_view_details')}
          </button>
        </div>
      </div>
    </div>
  );
};
