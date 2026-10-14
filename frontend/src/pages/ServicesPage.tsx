import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  FileCheck2,
  Video,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  IndianRupee
} from 'lucide-react';
import { Service, Tutorial } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';

interface ServicesPageProps {
  services: Service[];
  tutorials: Tutorial[];
  onViewDetails: (service: Service) => void;
}

const CATEGORIES = ['All', 'Identity', 'Certificates', 'Transport', 'Healthcare', 'Welfare'];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  tutorials,
  onViewDetails
}) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.department && s.department.toLowerCase().includes(q));

    const matchesCat = selectedCat === 'All' || s.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
          Essential Citizen Documents & Services Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official statutory guidance for Aadhaar, PAN card, Domicile, and Driving License with verified fees, timelines, and accepted alternative documents.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service (e.g. Aadhaar update, PAN card, Domicile)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCat === cat
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((service) => (
          <ServiceCard
            key={service.code}
            service={service}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Watch & Learn Video Tutorials Section */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600" />
            <span>Watch & Learn — Official Video Guides</span>
          </h2>
          <p className="text-xs text-slate-500">
            Curated walkthroughs published by authorized government channels to assist citizens step-by-step
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tutorials.map((tut) => (
            <div
              key={tut.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-28 bg-slate-900 rounded-xl mb-3 flex items-center justify-center text-red-500 relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    ▶
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {tut.duration}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs line-clamp-2 mb-1">
                  {tut.title}
                </h4>
                <div className="text-[11px] text-slate-500 mb-2">
                  {tut.publisher}
                </div>
              </div>

              <a
                href={tut.video_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 text-center bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 transition flex items-center justify-center gap-1"
              >
                <span>Watch on Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
