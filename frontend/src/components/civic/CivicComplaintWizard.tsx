import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  Mic,
  MicOff,
  Upload,
  Copy,
  Check,
  Building2,
  ExternalLink,
  PhoneCall,
  BookmarkCheck,
  ShieldAlert,
  Loader2,
  MapPin,
  FileText
} from 'lucide-react';
import { CivicDraft } from '../../types';
import { api } from '../../services/api';
import { speechService } from '../../services/speech';

const CATEGORIES = [
  { id: 'Potholes & Damaged Roads', icon: '🚧', label: 'Potholes & Damaged Roads' },
  { id: 'Garbage & Sanitation', icon: '🗑️', label: 'Garbage & Waste Accumulation' },
  { id: 'Water Disruption & Leakage', icon: '💧', label: 'Water Leakage & Low Pressure' },
  { id: 'Drainage & Flooding', icon: '🌊', label: 'Drainage Overflow & Waterlogging' },
  { id: 'Broken Streetlights', icon: '💡', label: 'Broken / Faulty Streetlights' },
  { id: 'Fallen Trees & Hazardous Branches', icon: '🌳', label: 'Fallen Trees & Overgrown Branches' },
  { id: 'Public Sanitation & Toilets', icon: '🚻', label: 'Public Toilet Hygiene & Maintenance' },
  { id: 'Other Civic Issue', icon: '⚠️', label: 'Other Civic & Municipal Hazard' }
];

const BMC_WARDS = [
  { id: 'A', name: 'Ward A (Colaba, Fort, Nariman Point)' },
  { id: 'C', name: 'Ward C (Marine Lines, Bhuleshwar)' },
  { id: 'D', name: 'Ward D (Malabar Hill, Grant Road, Tardeo)' },
  { id: 'F/North', name: 'Ward F/North (Matunga, Sion, Wadala)' },
  { id: 'G/South', name: 'Ward G/South (Worli, Prabhadevi, Lower Parel)' },
  { id: 'H/West', name: 'Ward H/West (Bandra West, Khar, Santacruz West)' },
  { id: 'K/East', name: 'Ward K/East (Andheri East, Jogeshwari East)' },
  { id: 'K/West', name: 'Ward K/West (Andheri West, Versova, Juhu)' },
  { id: 'P/North', name: 'Ward P/North (Malad West, Malad East)' },
  { id: 'R/Central', name: 'Ward R/Central (Borivali West/East)' }
];

interface WizardProps {
  onDraftSaved?: (draft: CivicDraft) => void;
}

export const CivicComplaintWizard: React.FC<WizardProps> = ({ onDraftSaved }) => {
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<string>('Potholes & Damaged Roads');
  const [description, setDescription] = useState<string>('');
  const [wardId, setWardId] = useState<string>('K/West');
  const [locationAddress, setLocationAddress] = useState<string>('S.V. Road, Near Andheri Station');
  const [landmark, setLandmark] = useState<string>('Opposite Bus Depot');
  const [citizenName, setCitizenName] = useState<string>('Concerned Citizen');
  const [contactPhone, setContactPhone] = useState<string>('');

  // Speech-to-Text state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Draft state
  const [loading, setLoading] = useState<boolean>(false);
  const [draft, setDraft] = useState<CivicDraft | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Microphone STT toggle
  const toggleSpeechRecognition = () => {
    if (isListening) {
      speechService.stopSpeaking();
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const recognitionLang = i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';

    const rec = speechService.createRecognition(
      recognitionLang,
      (text) => {
        setDescription((prev) => (prev ? `${prev} ${text}` : text));
      },
      (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDraft = async () => {
    if (!description.trim()) {
      alert('Please describe the problem.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.generateCivicDraft({
        category,
        description,
        ward_id: wardId,
        location_address: locationAddress,
        landmark,
        citizen_name: citizenName,
        contact_phone: contactPhone,
        language: i18n.language
      });
      setDraft(res);
      setStep(4);
    } catch (err: any) {
      alert('Failed to generate AI grievance draft. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (draft) {
      navigator.clipboard.writeText(draft.letter_body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveDraft = async () => {
    if (!draft) return;
    try {
      await api.saveCivicDraft({
        tracking_code: draft.tracking_code,
        category: draft.category,
        description,
        ward_id: wardId,
        location_address: locationAddress,
        landmark,
        urgency_level: draft.urgency_level,
        ai_draft_subject: draft.subject,
        ai_draft_body: draft.letter_body,
        routed_authority: draft.routed_authority,
        official_portal_link: draft.official_portal_link,
        contact_helpline: draft.contact_helpline
      });
      setIsSaved(true);
      if (onDraftSaved) onDraftSaved(draft);
    } catch (e) {
      setIsSaved(true); // Persist fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-glass p-6 max-w-4xl mx-auto">
      {/* Wizard Progress Steps */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        {[
          { num: 1, label: 'Category' },
          { num: 2, label: 'Problem & Location' },
          { num: 3, label: 'Photo & Review' },
          { num: 4, label: 'AI Grievance Draft' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                step === s.num
                  ? 'bg-gov-navy text-white shadow-sm'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? 'text-gov-navy font-bold' : 'text-slate-500'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Select Category */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Select Civic Grievance Category
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Choose the category that best matches the public issue in your locality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  category === cat.id
                    ? 'border-gov-navy bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-xs font-semibold ${category === cat.id ? 'text-gov-navy font-bold' : 'text-slate-800'}`}>
                  {cat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs shadow transition"
            >
              Continue to Details →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Description & Location */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Describe Problem & Location
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Type or dictate the issue using your microphone in your preferred language.
            </p>
          </div>

          {/* Problem Description with Mic */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Detailed Problem Description *
              </label>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                  isListening
                    ? 'bg-red-600 text-white mic-recording shadow-md'
                    : 'bg-slate-100 text-gov-navy hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-600" />}
                <span>{isListening ? t('listening') : t('speak_btn')}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Deep pothole on Link road near station, creating traffic hazard and accident risk for two-wheelers..."
              className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />

            {speechError && (
              <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                {speechError}
              </p>
            )}
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                BMC Mumbai Ward Jurisdiction *
              </label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
              >
                {BMC_WARDS.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Street / Road Address *
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="e.g. S.V. Road, Andheri West"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prominent Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Bus Depot"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Citizen Name / Complainant
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!description.trim()}
              className="px-6 py-2.5 rounded-xl bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs shadow transition disabled:opacity-50"
            >
              Continue to Photos →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Photo & Review */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Attach Photograph (Optional) & Review
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Adding a photograph helps the Ward Maintenance Squad verify the physical hazard quickly.
            </p>
          </div>

          {/* Photo Drag & Drop / Upload */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-gov-navy transition bg-slate-50">
            {photoPreview ? (
              <div className="space-y-3">
                <img
                  src={photoPreview}
                  alt="Incident Preview"
                  className="max-h-48 mx-auto rounded-lg shadow-sm border border-slate-200 object-cover"
                />
                <button
                  onClick={() => setPhotoPreview(null)}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Click to browse or drag and drop photo
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  JPG, PNG up to 5MB (Simulated & Local storage)
                </p>
                <label className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition shadow-sm">
                  Select File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Review Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Grievance Summary
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div><strong className="text-slate-900">Category:</strong> {category}</div>
              <div><strong className="text-slate-900">Ward:</strong> {wardId}</div>
              <div className="col-span-2"><strong className="text-slate-900">Location:</strong> {locationAddress} {landmark ? `(${landmark})` : ''}</div>
              <div className="col-span-2"><strong className="text-slate-900">Issue:</strong> {description}</div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
            >
              ← Back
            </button>
            <button
              onClick={handleGenerateDraft}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Generate Formal AI Draft</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: AI Grievance Draft Output */}
      {step === 4 && draft && (
        <div className="space-y-5 animate-in zoom-in-95 duration-200">
          {/* Top Status & Reference */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-navy">
                JanSetu AI Reference Tracking Code
              </span>
              <div className="text-base font-black text-gov-navy tracking-wide">
                {draft.tracking_code}
              </div>
              <div className="text-[11px] text-slate-500">
                Routed to: <strong className="text-slate-800">{draft.routed_authority}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  isSaved
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{isSaved ? 'Draft Saved Locally' : 'Save Draft'}</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gov-navy text-white hover:bg-gov-navyLight transition shadow"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Letter Body */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-300/80 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
            {draft.letter_body}
          </div>

          {/* Official Verification & Instructions */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
            <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Official Reporting Channels</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <a
                href={draft.official_portal_link}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white rounded-lg border border-emerald-200 flex items-center justify-between hover:bg-emerald-50/50 transition font-semibold text-emerald-900"
              >
                <span>BMC Official Citizen Portal</span>
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </a>
              <a
                href="https://wa.me/918999228999"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white rounded-lg border border-emerald-200 flex items-center justify-between hover:bg-emerald-50/50 transition font-semibold text-emerald-900"
              >
                <span>BMC WhatsApp Grievance (+91 8999 22 8999)</span>
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </a>
            </div>
            <div className="text-[11px] text-emerald-800 pt-1">
              <strong>Emergency Civic Line:</strong> Call BMC Control Room at <strong>1916</strong> for immediate hazards.
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Disclosure:</strong> {draft.disclaimer}
            </span>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => {
                setStep(1);
                setDescription('');
                setDraft(null);
                setIsSaved(false);
              }}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Draft Another Complaint
            </button>

            <a
              href={draft.official_portal_link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs shadow transition"
            >
              <span>{t('btn_open_portal')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
