import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PhoneCall,
  Volume2,
  VolumeX,
  ShieldAlert,
  Search,
  AlertCircle,
  Clock,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { Helpline } from '../../types';
import { speechService } from '../../services/speech';

interface EmergencyHelpProps {
  helplines: Helpline[];
}

export const EmergencyHelpView: React.FC<EmergencyHelpProps> = ({ helplines }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [search, setSearch] = useState('');
  const [playingNumber, setPlayingNumber] = useState<string | null>(null);

  const filtered = helplines.filter(h => {
    const q = search.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.number.includes(q) ||
      h.category.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q)
    );
  });

  const handleSpeakInstructions = (h: Helpline) => {
    if (playingNumber === h.number) {
      speechService.stopSpeaking();
      setPlayingNumber(null);
      return;
    }

    const langCode = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    const textToSpeak = `Helpline ${h.number}: ${h.name}. ${h.description}. Dispatch Instructions: ${h.instructions || ''}`;

    setPlayingNumber(h.number);
    speechService.speak(
      textToSpeak,
      langCode,
      () => setPlayingNumber(null),
      () => setPlayingNumber(null)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Life-Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-xl border border-red-500 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-800/80 text-white text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Pan-India Unified Emergency Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            National Emergency Helpline: Dial 112
          </h2>
          <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
            Single toll-free emergency number across India connecting instantly to Police, Fire, Ambulance, and Disaster Response squads with GPS location coordination.
          </p>
        </div>

        <a
          href="tel:112"
          className="flex-shrink-0 flex items-center gap-3 bg-white hover:bg-slate-100 text-red-700 px-8 py-4 rounded-2xl font-black text-xl shadow-2xl transition hover:scale-105 active:scale-95 animate-pulse"
        >
          <PhoneCall className="w-6 h-6 text-red-600 fill-red-600" />
          <span>CALL 112 NOW</span>
        </a>
      </div>

      {/* Dispatch Guidance Card: What to tell the operator */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
        <div className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          <span>Protocol: What to tell the emergency dispatcher when calling 112</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-amber-900 pt-1">
          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>1. Exact Location:</strong> Mention street name, landmark, building number, and city/district.</span>
          </div>
          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>2. Situation & Casualties:</strong> State if anyone is unconscious, injured, trapped, or bleeding.</span>
          </div>
          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>3. Stay On The Line:</strong> Do not disconnect until the operator tells you units are dispatched.</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search helpline by service (e.g. ambulance, cyber fraud, child)..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
        />
      </div>

      {/* Emergency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isPlaying = playingNumber === item.number;
          const isCritical = ['112', '102 / 108', '1930'].includes(item.number);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isCritical
                  ? 'bg-white border-red-200 shadow-md hover:shadow-lg'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      {item.number}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.operational_hours}
                    </span>
                    <button
                      onClick={() => handleSpeakInstructions(item)}
                      className={`p-1.5 rounded-full transition ${
                        isPlaying ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-gov-navy hover:bg-slate-100'
                      }`}
                      title="Read instructions aloud"
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {item.name}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed mb-3">
                  {item.description}
                </p>

                {item.instructions && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 mb-3">
                    <strong className="text-slate-800">Dispatch Advice: </strong>
                    {item.instructions}
                  </div>
                )}
              </div>

              {/* Tap to Call Link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Coverage: {item.coverage}</span>
                <a
                  href={`tel:${item.number.split('/')[0].trim()}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    isCritical
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gov-navy hover:bg-gov-navyLight text-white'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
