import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  Building2,
  PhoneCall,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2
} from 'lucide-react';
import { CivicComplaintWizard } from '../components/civic/CivicComplaintWizard';
import { api } from '../services/api';

export const CivicPage: React.FC = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'wizard' | 'directory'>('wizard');
  const [authoritiesData, setAuthoritiesData] = useState<any>(null);
  const [wardSearch, setWardSearch] = useState('');

  useEffect(() => {
    api.getAuthorities().then(setAuthoritiesData).catch(() => {});
  }, []);

  const wards = authoritiesData?.wards || [];
  const filteredWards = wards.filter((w: any) =>
    w.name.toLowerCase().includes(wardSearch.toLowerCase()) ||
    w.ward_id.toLowerCase().includes(wardSearch.toLowerCase()) ||
    w.office.toLowerCase().includes(wardSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            Civic Grievance Redressal Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Report road potholes, garbage accumulation, or water leakage. Draft statutory grievance letters routed to your local BMC Ward.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-4 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'wizard' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Draft Grievance with AI
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'directory' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            BMC Ward Directory
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'wizard' ? (
        <CivicComplaintWizard />
      ) : (
        /* Ward Directory View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={wardSearch}
                onChange={(e) => setWardSearch(e.target.value)}
                placeholder="Search BMC ward by name or area (e.g. Andheri, Bandra, Colaba)..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Building2 className="w-4 h-4 text-gov-navy" />
              <span>Brihanmumbai Municipal Corporation (BMC/MCGM)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWards.map((w: any) => (
              <div
                key={w.ward_id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-gov-navy border border-blue-200">
                      Ward {w.ward_id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">
                      {w.name}
                    </h4>
                  </div>
                  <a
                    href={`tel:${w.phone}`}
                    className="p-2 rounded-xl bg-slate-100 text-gov-navy hover:bg-slate-200 transition"
                    title="Call Ward Office"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{w.office}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Officer: <strong className="text-slate-800">{w.officer}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Helpline: <strong>{w.phone}</strong></span>
                  <a
                    href="https://portal.mcgm.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gov-navy font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Lodge on BMC Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
