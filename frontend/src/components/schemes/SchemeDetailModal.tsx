import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Volume2,
  BookmarkCheck,
  Bookmark,
  CheckCircle2,
  Calendar,
  Building2,
  ListChecks,
  ArrowRight
} from 'lucide-react';
import { Scheme } from '../../types';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  onOpenEligibility: (scheme: Scheme) => void;
  isSaved: boolean;
  onToggleSave: (scheme: Scheme, checklistState?: Record<string, boolean>) => void;
  onSpeak: (text: string) => void;
  initialChecklistState?: Record<string, boolean>;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  onClose,
  onOpenEligibility,
  isSaved,
  onToggleSave,
  onSpeak,
  initialChecklistState = {}
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [checklist, setChecklist] = useState<Record<string, boolean>>(initialChecklistState);

  useEffect(() => {
    setChecklist(initialChecklistState);
  }, [scheme, initialChecklistState]);

  if (!scheme) return null;

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

  const toggleDocument = (docName: string) => {
    const updated = { ...checklist, [docName]: !checklist[docName] };
    setChecklist(updated);
    if (isSaved) {
      onToggleSave(scheme, updated);
    }
  };

  const totalDocs = scheme.required_documents.length;
  const readyDocs = scheme.required_documents.filter(d => checklist[d.name]).length;
  const progressPercent = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0;

  const handleReadAloud = () => {
    const textToSpeak = `${title}. ${description}. Key benefits include: ${scheme.key_benefits.slice(0, 2).join('. ')}.`;
    onSpeak(textToSpeak);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                scheme.level === 'Central'
                  ? 'bg-blue-100 text-gov-navy'
                  : 'bg-orange-100 text-orange-900'
              }`}>
                {scheme.level === 'Central' ? '🇮🇳 Central Government Scheme' : `🚩 ${scheme.state} State Scheme`}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-medium">
                {scheme.category}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {t('verified_on')} {scheme.last_verified_date}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {title}
            </h2>
            {scheme.ministry && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{scheme.ministry}</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Quick Action Controls Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200/80">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReadAloud}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy hover:bg-gov-navyLight text-white rounded-lg font-semibold text-xs transition shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t('btn_listen')}</span>
              </button>
              <button
                onClick={() => onToggleSave(scheme, checklist)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition border ${
                  isSaved
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? t('btn_saved') : t('btn_save_scheme')}</span>
              </button>
            </div>

            <button
              onClick={() => onOpenEligibility(scheme)}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition shadow-sm"
            >
              <span>{t('btn_check_eligibility')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-gov-navy">
              Overview & Objectives
            </h4>
            <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              {description}
            </p>
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-gov-navy">
              Key Scheme Benefits
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scheme.key_benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-gov-navy">
                <ListChecks className="w-4 h-4 text-gov-navy" />
                <span>{t('readiness_checklist')}</span>
              </h4>
              <span className="text-xs font-bold text-slate-700">
                {readyDocs}/{totalDocs} Ready ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2">
              {scheme.required_documents.map((doc, idx) => {
                const isChecked = !!checklist[doc.name];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDocument(doc.name)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Handled by div click
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isChecked ? 'text-emerald-950' : 'text-slate-900'}`}>
                          {doc.name}
                        </span>
                        {doc.mandatory && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Application Steps */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-gov-navy">
              Official Step-by-Step Application Process
            </h4>
            <div className="space-y-2">
              {scheme.application_steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-5 h-5 rounded-full bg-gov-navy text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Source: <strong className="text-slate-700">{scheme.source_citation}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Close
            </button>
            <a
              href={scheme.official_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gov-navy hover:bg-gov-navyLight text-white shadow transition"
            >
              <span>{t('btn_open_portal')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
