import React from 'react';
import { ExternalLink, ShieldCheck, HeartHandshake, FileCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-20">
      {/* Tricolor Ribbon */}
      <div className="tricolor-bar w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About JanSetu AI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                🏛️
              </div>
              <span className="font-bold text-white text-sm tracking-wide font-serif">
                JANSETU AI (जनसेतु AI)
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              One Platform. Every Citizen. Clear Next Steps.
              An AI-assisted, multilingual public service discovery and grievance drafting platform for Indian citizens.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in Official Sources</span>
            </div>
          </div>

          {/* Col 2: Official Government Portals */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Government Portals</span>
            </div>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>myScheme Portal (MeitY)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://services.india.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>National Government Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://portal.mcgm.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>BMC Mumbai Grievance Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>CPGRAMS Central Grievance</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Citizen Rights & Helplines */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>Emergency & Helplines</span>
            </div>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="flex items-center justify-between">
                <span>112 — National Unified Emergency</span>
                <span className="text-amber-400 font-bold">24x7</span>
              </li>
              <li className="flex items-center justify-between">
                <span>108 / 102 — Free Ambulance</span>
                <span className="text-amber-400 font-bold">Free</span>
              </li>
              <li className="flex items-center justify-between">
                <span>1098 — Childline India</span>
                <span className="text-amber-400 font-bold">24x7</span>
              </li>
              <li className="flex items-center justify-between">
                <span>1930 — Cyber Crime Fraud</span>
                <span className="text-amber-400 font-bold">Instant</span>
              </li>
              <li className="flex items-center justify-between">
                <span>1916 — BMC Disaster Helpline</span>
                <span className="text-amber-400 font-bold">Mumbai</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Transparency & Languages */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Accessibility & Support</span>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              Designed for high accessibility, multilingual literacy, and low-bandwidth connections.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px]">English</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px]">हिन्दी (Hindi)</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px]">मराठी (Marathi)</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px]">Hinglish</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Web Speech API • STT & TTS Enabled
            </div>
          </div>
        </div>

        {/* Bottom Bar & Statutory Disclaimer */}
        <div className="pt-6 border-t border-slate-800 text-center space-y-2">
          <p className="text-slate-400 text-[11px] max-w-4xl mx-auto leading-relaxed">
            <span className="font-semibold text-amber-400">Statutory Notice:</span> JanSetu AI is an informational technology prototype designed to assist citizens in discovering public services, understanding eligibility, preparing required documents, and drafting formal grievances. JanSetu AI does not claim to replace official government portals, guarantee scheme eligibility, or directly submit complaints without statutory authority. All applications and final approvals are governed solely by designated Central/State authorities.
          </p>
          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} JanSetu AI — Built for Algothon Hackathon MVP. Open citizen service standards.
          </div>
        </div>
      </div>
    </footer>
  );
};
