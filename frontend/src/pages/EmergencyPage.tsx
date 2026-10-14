import React from 'react';
import { Helpline } from '../types';
import { EmergencyHelpView } from '../components/emergency/EmergencyHelpView';

interface EmergencyPageProps {
  helplines: Helpline[];
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ helplines }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif flex items-center gap-2">
          <span className="text-red-600">🚨</span>
          <span>Emergency Assistance & National Helplines</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct 24x7 verified phone lines for immediate emergency dispatch. Operates with single-tap calling without login.
        </p>
      </div>

      <EmergencyHelpView helplines={helplines} />
    </div>
  );
};
