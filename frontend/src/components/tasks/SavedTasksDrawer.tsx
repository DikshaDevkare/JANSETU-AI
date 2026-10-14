import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Trash2,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertTriangle,
  FileCheck2,
  BookmarkCheck,
  Copy,
  Check
} from 'lucide-react';
import { SavedTask, Scheme, CivicDraft } from '../../types';

interface TasksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSchemes: Scheme[];
  savedChecklists: Record<string, Record<string, boolean>>;
  savedDrafts: any[];
  onRemoveScheme: (code: string) => void;
  onOpenScheme: (scheme: Scheme) => void;
  onDeleteDraft: (trackingCode: string) => void;
}

export const SavedTasksDrawer: React.FC<TasksDrawerProps> = ({
  isOpen,
  onClose,
  savedSchemes,
  savedChecklists,
  savedDrafts,
  onRemoveScheme,
  onOpenScheme,
  onDeleteDraft
}) => {
  const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const totalItems = savedSchemes.length + savedDrafts.length;

  const handleCopy = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              My Saved Tasks & Documents ({totalItems})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {totalItems === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                📋
              </div>
              <h4 className="text-sm font-bold text-slate-700">No Saved Tasks Yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Bookmark schemes to track your document checklist progress or save civic complaint drafts here for later review.
              </p>
            </div>
          ) : (
            <>
              {/* Saved Schemes Section */}
              {savedSchemes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gov-navy flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gov-navy" />
                    <span>Saved Schemes ({savedSchemes.length})</span>
                  </h4>
                  <div className="space-y-2.5">
                    {savedSchemes.map((scheme) => {
                      const chk = savedChecklists[scheme.code] || {};
                      const totalDocs = scheme.required_documents.length;
                      const readyDocs = scheme.required_documents.filter(d => chk[d.name]).length;
                      const pct = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0;

                      return (
                        <div
                          key={scheme.code}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {scheme.category}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs mt-1">
                                {scheme.title}
                              </h5>
                            </div>
                            <button
                              onClick={() => onRemoveScheme(scheme.code)}
                              className="text-slate-400 hover:text-red-600 p-1 transition"
                              title="Remove scheme"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Progress bar */}
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>Checklist: {readyDocs}/{totalDocs} Docs</span>
                              <span className="font-bold text-slate-700">{pct}% Ready</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 transition-all rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => {
                                onClose();
                                onOpenScheme(scheme);
                              }}
                              className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
                            >
                              <span>Open Checklist</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Saved Civic Drafts Section */}
              {savedDrafts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gov-navy flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-gov-navy" />
                    <span>Saved Grievance Drafts ({savedDrafts.length})</span>
                  </h4>
                  <div className="space-y-2.5">
                    {savedDrafts.map((draft, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-gov-navy bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {draft.tracking_code}
                            </span>
                            <h5 className="font-bold text-slate-900 text-xs mt-1">
                              {draft.category}
                            </h5>
                            <div className="text-[11px] text-slate-500">
                              {draft.routed_authority}
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteDraft(draft.tracking_code)}
                            className="text-slate-400 hover:text-red-600 p-1 transition"
                            title="Delete draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleCopy(draft.ai_draft_body || draft.letter_body, draft.tracking_code)}
                            className="text-gov-navy font-bold hover:underline flex items-center gap-1"
                          >
                            {copiedCode === draft.tracking_code ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Draft Text</span>
                              </>
                            )}
                          </button>

                          <a
                            href={draft.official_portal_link || 'https://portal.mcgm.gov.in'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-600 hover:text-gov-navy font-semibold flex items-center gap-1"
                          >
                            <span>Open BMC Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
