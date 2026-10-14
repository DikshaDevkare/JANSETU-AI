import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { Scheme, EligibilityResult } from '../../types';
import { api } from '../../services/api';

interface EligibilityModalProps {
  scheme: Scheme | null;
  onClose: () => void;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  scheme,
  onClose
}) => {
  const { t } = useTranslation();

  const [age, setAge] = useState<number | ''>(35);
  const [gender, setGender] = useState<string>('Female');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(150000);
  const [occupation, setOccupation] = useState<string>('Farmer');
  const [state, setState] = useState<string>('Maharashtra');
  const [landholding, setLandholding] = useState<number | ''>(2.5);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!scheme) return null;

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.checkEligibility({
        scheme_code: scheme.code,
        scheme_id: scheme.id,
        age: age === '' ? undefined : Number(age),
        gender,
        annual_income: annualIncome === '' ? undefined : Number(annualIncome),
        occupation,
        state,
        landholding_acres: landholding === '' ? undefined : Number(landholding)
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to evaluate eligibility. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gov-navy">
              Eligibility Assessment Questionnaire
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {scheme.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!result ? (
            <form onSubmit={handleEvaluate} className="space-y-4">
              <p className="text-xs text-slate-600 bg-blue-50/70 p-3 rounded-lg border border-blue-200/60">
                Please provide your demographic information. JanSetu AI will cross-reference your answers against the published eligibility rules for this scheme.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Household Income (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                    placeholder="e.g. 150000"
                  />
                </div>

                {/* Occupation / Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Occupation / Category
                  </label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
                  >
                    <option value="Farmer">Farmer (कृषक / शेतकरी)</option>
                    <option value="Student">Student (विद्यार्थी)</option>
                    <option value="Artisan">Traditional Artisan / Craftsman (विश्वकर्मा)</option>
                    <option value="Street Vendor">Street Vendor / Hawker (फेरीवाला)</option>
                    <option value="Business">Small Business / Self-Employed</option>
                    <option value="Senior Citizen">Senior Citizen (वयस्क)</option>
                    <option value="Homemaker">Homemaker / Housewife</option>
                    <option value="Unorganized Worker">Unorganized / Daily Wage Worker</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State of Residence
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
                  >
                    <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Other">Other State / UT</option>
                  </select>
                </div>

                {/* Landholding (if relevant) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agricultural Landholding (Acres)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={landholding}
                    onChange={(e) => setLandholding(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                    placeholder="e.g. 2.5 (leave 0 if none)"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg shadow transition disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Evaluate Eligibility</span>
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-4">
              {/* Overall Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                result.overall_status === 'Likely Eligible'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : result.overall_status === 'Ineligible (Conditions Not Met)'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider">Assessment Status</div>
                  <div className="text-lg font-black">{result.overall_status}</div>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white border transition shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Check Again</span>
                </button>
              </div>

              {/* Satisfied Conditions */}
              {result.satisfied_requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Conditions Satisfied ({result.satisfied_requirements.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {result.satisfied_requirements.map((req, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                        <div className="font-semibold text-emerald-900">{req.condition}</div>
                        <div className="text-emerald-700 mt-0.5">{req.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Needs Clarification */}
              {result.needs_clarification.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Conditions Needing Clarification ({result.needs_clarification.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {result.needs_clarification.map((req, idx) => (
                      <div key={idx} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs">
                        <div className="font-semibold text-amber-900">{req.condition}</div>
                        <div className="text-amber-700 mt-0.5">{req.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unverified Requirements */}
              {result.unverified_requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Requirements to Verify at Application ({result.unverified_requirements.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {result.unverified_requirements.map((req, idx) => (
                      <div key={idx} className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-xs">
                        <div className="font-semibold text-blue-900">{req.condition}</div>
                        <div className="text-blue-700 mt-0.5">{req.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statutory Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700">Official Disclaimer: </span>
                {result.disclaimer}
              </div>

              {/* Official Source and Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Source: <strong>{result.official_source}</strong></span>
                </div>
                <a
                  href={result.official_portal_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gov-navy text-white hover:bg-gov-navyLight transition shadow"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
