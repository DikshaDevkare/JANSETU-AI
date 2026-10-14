import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  FileText,
  AlertTriangle,
  FileCheck2,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Volume2,
  Building2,
  ExternalLink
} from 'lucide-react';
import { Scheme, Service, Helpline } from '../types';
import { speechService } from '../services/speech';

interface DashboardProps {
  onNavigate: (view: string, query?: string) => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
  featuredSchemes: Scheme[];
  onCheckEligibility: (scheme: Scheme) => void;
  onViewSchemeDetails: (scheme: Scheme) => void;
  helplines: Helpline[];
}

export const DashboardPage: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenAssistantWithPrompt,
  featuredSchemes,
  onCheckEligibility,
  onViewSchemeDetails,
  helplines
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate('schemes', searchQuery.trim());
  };

  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopSpeaking();
      setIsListening(false);
      return;
    }

    const recLang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    const rec = speechService.createRecognition(
      recLang,
      (text) => {
        setSearchQuery(text);
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );

    if (rec) {
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-gov-navy via-gov-navyDark to-gov-navyLight text-white overflow-hidden shadow-2xl p-8 sm:p-12 border border-white/10">
        {/* Subtle decorative glow & tricolor flag watermark */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Citizen Public Services Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-serif">
            {t('portal_tagline')}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {t('hero_desc')}
          </p>

          {/* Universal Voice Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1.5 border-2 border-amber-400/80 focus-within:ring-4 focus-within:ring-amber-400/30 transition">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isListening ? "Listening in your language... speak now" : t('search_placeholder')}
                className="w-full px-3 py-3 text-slate-900 text-sm focus:outline-none placeholder-slate-400"
              />

              {/* Microphone STT Button */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2.5 rounded-xl transition mr-1 flex items-center gap-1 ${
                  isListening
                    ? 'bg-red-600 text-white mic-recording shadow-md'
                    : 'text-slate-500 hover:text-gov-navy hover:bg-slate-100'
                }`}
                title={isListening ? "Listening... click to stop" : "Speak to search"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-red-600" />}
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-sm shadow-md transition flex items-center gap-1.5 flex-shrink-0"
              >
                <span>{t('search_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Suggested Quick Question Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-300 text-[11px]">Popular:</span>
            {[
              { label: '🌾 PM-KISAN ₹6,000', query: 'PM-KISAN' },
              { label: '🏥 Ayushman Bharat ₹5 Lakh', query: 'Ayushman' },
              { label: '👩 Majhi Ladki Bahin ₹1,500', query: 'Ladki Bahin' },
              { label: '🆔 Aadhaar Address Update', query: 'Aadhaar' },
              { label: '🚧 Report Road Pothole', view: 'civic' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => chip.view ? onNavigate(chip.view) : onNavigate('schemes', chip.query)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 text-[11px] transition"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Prominent Core Modules Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Core Public Service Modules
            </h2>
            <p className="text-xs text-slate-500">
              Direct access to all verified citizen services with AI assistance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Module 1: Schemes & Benefits */}
          <div
            onClick={() => onNavigate('schemes')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-gov hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group glass-shine flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-gov-navy border border-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FileText className="w-6 h-6 text-gov-navy" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-gov-navy transition mb-1">
                {t('module_schemes_title')}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                {t('module_schemes_desc')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gov-navy">
              <span>{t('btn_explore')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Module 2: Civic Complaints */}
          <div
            onClick={() => onNavigate('civic')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-gov hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group glass-shine flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-gov-navy transition mb-1">
                {t('module_civic_title')}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                {t('module_civic_desc')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gov-navy">
              <span>Draft Complaint</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Module 3: Documents & Services */}
          <div
            onClick={() => onNavigate('services')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-gov hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group glass-shine flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FileCheck2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-gov-navy transition mb-1">
                {t('module_services_title')}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                {t('module_services_desc')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gov-navy">
              <span>View Guides</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Module 4: Emergency Help */}
          <div
            onClick={() => onNavigate('emergency')}
            className="p-6 rounded-2xl bg-white border border-red-200 shadow-gov hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group glass-shine flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <PhoneCall className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-red-700 transition mb-1">
                {t('module_emergency_title')}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                {t('module_emergency_desc')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Tap to Call 112</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Schemes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Prominent Government Schemes
            </h2>
            <p className="text-xs text-slate-500">
              Verified active welfare programs with instant eligibility assessment
            </p>
          </div>
          <button
            onClick={() => onNavigate('schemes')}
            className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
          >
            <span>View All Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredSchemes.slice(0, 3).map((scheme) => (
            <div
              key={scheme.code}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-gov hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col justify-between glass-shine group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-gov-navy border border-blue-200">
                    {scheme.level === 'Central' ? '🇮🇳 Central' : `🚩 ${scheme.state}`}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {scheme.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-gov-navy transition mb-2">
                  {scheme.title}
                </h3>

                <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-3">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onCheckEligibility(scheme)}
                  className="px-3 py-1.5 rounded-lg bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs shadow-sm transition"
                >
                  Check Eligibility
                </button>
                <button
                  onClick={() => onViewSchemeDetails(scheme)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Quick Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1 text-center lg:text-left">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            24x7 Emergency Helplines (No Login Required)
          </div>
          <div className="text-lg font-black font-serif">
            Immediate Assistance in Case of Distress
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:112"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>112 (National All-in-One)</span>
          </a>
          <a
            href="tel:108"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>108 (Ambulance)</span>
          </a>
          <a
            href="tel:1098"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>1098 (Childline)</span>
          </a>
          <a
            href="tel:1930"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
          >
            <PhoneCall className="w-4 h-4 text-blue-400" />
            <span>1930 (Cyber Fraud)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
