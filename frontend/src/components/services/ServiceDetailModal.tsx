import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Clock,
  IndianRupee,
  Building2,
  FileCheck2,
  CheckCircle2,
  HelpCircle,
  Video,
  ListChecks,
  AlertCircle
} from 'lucide-react';
import { Service, Tutorial } from '../../types';

interface ServiceDetailModalProps {
  service: Service | null;
  tutorials: Tutorial[];
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  tutorials,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [heldDocs, setHeldDocs] = useState<Record<string, boolean>>({});

  if (!service) return null;

  const title = (currentLang === 'hi' && service.title_hi)
    ? service.title_hi
    : (currentLang === 'mr' && service.title_mr)
    ? service.title_mr
    : service.title;

  const toggleHeldDoc = (name: string) => {
    setHeldDocs(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const relevantTutorials = tutorials.filter(tut => tut.service_code === service.code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gov-navy text-white font-bold">
                {service.category}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                <span>{service.verified_fees}</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{service.timeline}</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {title}
            </h2>
            {service.department && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{service.department}</span>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Purpose & Prerequisites */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gov-navy mb-1">
                Purpose & Legal Significance
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {service.purpose || service.description}
              </p>
            </div>

            {service.prerequisites && service.prerequisites.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Important Prerequisites</span>
                </h4>
                <ul className="space-y-1">
                  {service.prerequisites.map((prereq, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Interactive Document Readiness & Alternatives */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-gov-navy">
              <ListChecks className="w-4 h-4 text-gov-navy" />
              <span>Document Readiness & Official Alternatives Checklist</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Tick the documents you have. If you lack a required document, view verified alternative options below.
            </p>

            <div className="space-y-3">
              {service.required_documents.map((doc, idx) => {
                const isHeld = !!heldDocs[doc.name];
                return (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div
                      onClick={() => toggleHeldDoc(doc.name)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isHeld}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${isHeld ? 'text-emerald-900' : 'text-slate-800'}`}>
                          {doc.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHeld ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isHeld ? 'Ready' : 'Pending'}
                      </span>
                    </div>

                    {/* Official Document Alternatives */}
                    {!isHeld && doc.alternatives && doc.alternatives.length > 0 && (
                      <div className="ml-6 p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs">
                        <div className="font-semibold text-amber-900 text-[11px] mb-1 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Accepted Official Alternatives:</span>
                        </div>
                        <ul className="space-y-0.5 text-amber-800 text-[11px] list-disc list-inside">
                          {doc.alternatives.map((alt, aIdx) => (
                            <li key={aIdx}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-gov-navy">
              Official Step-by-Step Procedure
            </h4>
            <div className="space-y-2">
              {service.step_by_step.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-5 h-5 rounded-full bg-gov-navy text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Watch & Learn Video Guides */}
          {relevantTutorials.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-gov-navy">
                <Video className="w-4 h-4 text-red-600" />
                <span>Watch & Learn — Verified Video Guides</span>
              </h4>
              <div className="space-y-2.5">
                {relevantTutorials.map((tut) => (
                  <div key={tut.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{tut.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{tut.publisher}</span>
                        <span>•</span>
                        <span>{tut.duration} mins</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">{tut.verified_status}</span>
                      </div>
                    </div>
                    <a
                      href={tut.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Watch Guide</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Source: <strong className="text-slate-700">{service.source_citation}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Close
            </button>
            <a
              href={service.official_portal_url}
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
