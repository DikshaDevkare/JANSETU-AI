import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Scheme } from '../types';
import { SchemeCard } from '../components/schemes/SchemeCard';

interface SchemesPageProps {
  schemes: Scheme[];
  onCheckEligibility: (scheme: Scheme) => void;
  onViewDetails: (scheme: Scheme) => void;
  savedSchemeCodes: string[];
  onToggleSave: (scheme: Scheme) => void;
  onSpeak: (text: string) => void;
  initialSearchQuery?: string;
}

const CATEGORIES = [
  'All',
  'Agriculture',
  'Healthcare',
  'Housing',
  'Women & Children',
  'Business & Artisans',
  'Senior Citizens',
  'Education',
  'Social Welfare'
];

export const SchemesPage: React.FC<SchemesPageProps> = ({
  schemes,
  onCheckEligibility,
  onViewDetails,
  savedSchemeCodes,
  onToggleSave,
  onSpeak,
  initialSearchQuery = ''
}) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredSchemes = schemes.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(q) ||
      (s.title_hi && s.title_hi.toLowerCase().includes(q)) ||
      (s.title_mr && s.title_mr.toLowerCase().includes(q)) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLevel =
      selectedLevel === 'All' || s.level.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
          Government Schemes & Citizen Benefits
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore officially published central and state welfare programs. Evaluate your personal eligibility in real-time.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scheme by name, beneficiary, or keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          {/* Level Filter (Central vs State) */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Scope:</span>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs w-full sm:w-auto">
              {['All', 'Central', 'State'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-bold transition text-xs ${
                    selectedLevel === lvl
                      ? 'bg-gov-navy text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'All' ? 'All Schemes' : lvl === 'Central' ? '🇮🇳 Central' : '🚩 State'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <div className="text-3xl">🔍</div>
          <h3 className="text-base font-bold text-slate-800">No schemes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="mt-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.code}
              scheme={scheme}
              onCheckEligibility={onCheckEligibility}
              onViewDetails={onViewDetails}
              isSaved={savedSchemeCodes.includes(scheme.code)}
              onToggleSave={onToggleSave}
              onSpeak={onSpeak}
            />
          ))}
        </div>
      )}
    </div>
  );
};
