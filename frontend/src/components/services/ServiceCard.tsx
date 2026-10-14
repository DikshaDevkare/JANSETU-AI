import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileCheck2,
  Clock,
  IndianRupee,
  ExternalLink,
  ShieldCheck,
  Video,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  onViewDetails: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetails
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const title = (currentLang === 'hi' && service.title_hi)
    ? service.title_hi
    : (currentLang === 'mr' && service.title_mr)
    ? service.title_mr
    : service.title;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-gov hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between glass-shine group relative overflow-hidden">
      <div className="p-5 pb-3">
        {/* Category & Verified Fee Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {service.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <IndianRupee className="w-3 h-3" />
            <span>{service.verified_fees}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base group-hover:text-gov-navy transition mb-1 leading-snug">
          {title}
        </h3>

        {/* Department */}
        {service.department && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{service.department}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-3">
          {service.description}
        </p>

        {/* Timeline & Documents count */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{service.timeline}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{service.required_documents.length} Docs Needed</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={service.official_portal_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-gov-navy hover:text-gov-navyLight flex items-center gap-1"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          onClick={() => onViewDetails(service)}
          className="py-1.5 px-3.5 text-xs font-bold rounded-lg bg-gov-navy hover:bg-gov-navyLight text-white shadow-sm transition"
        >
          View Guide & Checklist
        </button>
      </div>
    </div>
  );
};
