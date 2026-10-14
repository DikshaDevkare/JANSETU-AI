import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GovernmentHeader } from './components/common/GovernmentHeader';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingAssistant } from './components/assistant/FloatingAssistant';
import { DashboardPage } from './pages/DashboardPage';
import { SchemesPage } from './pages/SchemesPage';
import { CivicPage } from './pages/CivicPage';
import { ServicesPage } from './pages/ServicesPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { SchemeDetailModal } from './components/schemes/SchemeDetailModal';
import { EligibilityModal } from './components/schemes/EligibilityModal';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { SavedTasksDrawer } from './components/tasks/SavedTasksDrawer';

import { Scheme, Service, Helpline, Tutorial, Language, SuggestedAction } from './types';
import { api } from './services/api';
import { speechService } from './services/speech';

export const App: React.FC = () => {
  const { i18n } = useTranslation();

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');

  // Accessibility & Localization
  const [currentLang, setCurrentLang] = useState<Language>(
    (localStorage.getItem('jansetu_language') as Language) || 'en'
  );
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Backend Data
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);

  // Modals & Drawers
  const [selectedSchemeForDetail, setSelectedSchemeForDetail] = useState<Scheme | null>(null);
  const [selectedSchemeForEligibility, setSelectedSchemeForEligibility] = useState<Scheme | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<Service | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isTasksDrawerOpen, setIsTasksDrawerOpen] = useState<boolean>(false);

  // Saved Items & Checklists (LocalStorage + Sync)
  const [savedSchemeCodes, setSavedSchemeCodes] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jansetu_saved_schemes') || '["PM_KISAN", "LADKI_BAHIN_MAHA"]');
    } catch {
      return ['PM_KISAN', 'LADKI_BAHIN_MAHA'];
    }
  });

  const [savedChecklists, setSavedChecklists] = useState<Record<string, Record<string, boolean>>>(() => {
    try {
      return JSON.parse(localStorage.getItem('jansetu_saved_checklists') || '{}');
    } catch {
      return {};
    }
  });

  const [savedDrafts, setSavedDrafts] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jansetu_saved_drafts') || '[]');
    } catch {
      return [];
    }
  });

  // Load Data on Mount
  useEffect(() => {
    api.getSchemes().then(setSchemes).catch(() => {});
    api.getServices().then(setServices).catch(() => {});
    api.getHelplines().then(setHelplines).catch(() => {});
    api.getTutorials().then(setTutorials).catch(() => {});
    api.getCivicDrafts().then((drafts) => {
      if (drafts && drafts.length > 0) {
        setSavedDrafts(drafts);
      }
    }).catch(() => {});
  }, []);

  // Sync Language
  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('jansetu_language', lang);
  };

  // Toggle Save Scheme
  const handleToggleSaveScheme = (scheme: Scheme, checklistState?: Record<string, boolean>) => {
    setSavedSchemeCodes((prev) => {
      const exists = prev.includes(scheme.code);
      const updated = exists ? prev.filter((c) => c !== scheme.code) : [...prev, scheme.code];
      localStorage.setItem('jansetu_saved_schemes', JSON.stringify(updated));
      return updated;
    });

    if (checklistState) {
      setSavedChecklists((prev) => {
        const updated = { ...prev, [scheme.code]: checklistState };
        localStorage.setItem('jansetu_saved_checklists', JSON.stringify(updated));
        return updated;
      });
    }

    // Backend sync
    api.saveTask({
      task_type: 'scheme',
      reference_id: scheme.code,
      reference_title: scheme.title,
      checklist_state: checklistState || savedChecklists[scheme.code] || {}
    }).catch(() => {});
  };

  const handleRemoveSavedScheme = (code: string) => {
    setSavedSchemeCodes((prev) => {
      const updated = prev.filter((c) => c !== code);
      localStorage.setItem('jansetu_saved_schemes', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteSavedDraft = (trackingCode: string) => {
    setSavedDrafts((prev) => {
      const updated = prev.filter((d) => d.tracking_code !== trackingCode);
      localStorage.setItem('jansetu_saved_drafts', JSON.stringify(updated));
      return updated;
    });
  };

  // Speech Listen Helper
  const handleSpeak = (text: string) => {
    const langCode = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    speechService.speak(text, langCode);
  };

  // Assistant Action Handler
  const handleTriggerAssistantAction = (action: SuggestedAction) => {
    if (action.action_type === 'navigate') {
      if (action.payload?.view) {
        setActiveTab(action.payload.view);
      }
      if (action.payload?.scheme_code) {
        const found = schemes.find((s) => s.code === action.payload.scheme_code);
        if (found) setSelectedSchemeForDetail(found);
      }
      if (action.payload?.service_code) {
        const found = services.find((s) => s.code === action.payload.service_code);
        if (found) setSelectedServiceForDetail(found);
      }
    } else if (action.action_type === 'check_eligibility') {
      if (action.payload?.scheme_code) {
        const found = schemes.find((s) => s.code === action.payload.scheme_code);
        if (found) setSelectedSchemeForEligibility(found);
      }
    } else if (action.action_type === 'open_link' && action.payload?.url) {
      window.open(action.payload.url, '_blank');
    } else if (action.action_type === 'call_helpline' && action.payload?.number) {
      window.location.href = `tel:${action.payload.number}`;
    }
  };

  const savedSchemesObjects = schemes.filter((s) => savedSchemeCodes.includes(s.code));
  const savedTasksCount = savedSchemeCodes.length + savedDrafts.length;

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 ${fontSize === 'lg' ? 'text-lg' : fontSize === 'sm' ? 'text-sm' : 'text-base'}`}>
      {/* Official Government Top Bar */}
      <GovernmentHeader
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        savedTasksCount={savedTasksCount}
        onOpenTasks={() => setIsTasksDrawerOpen(true)}
      />

      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigate={(view, query) => {
              setActiveTab(view);
              if (query) setInitialSearchQuery(query);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAssistantWithPrompt={(prompt) => {
              setIsAssistantOpen(true);
            }}
            featuredSchemes={schemes}
            onCheckEligibility={(scheme) => setSelectedSchemeForEligibility(scheme)}
            onViewSchemeDetails={(scheme) => setSelectedSchemeForDetail(scheme)}
            helplines={helplines}
          />
        )}

        {activeTab === 'schemes' && (
          <SchemesPage
            schemes={schemes}
            onCheckEligibility={(scheme) => setSelectedSchemeForEligibility(scheme)}
            onViewDetails={(scheme) => setSelectedSchemeForDetail(scheme)}
            savedSchemeCodes={savedSchemeCodes}
            onToggleSave={handleToggleSaveScheme}
            onSpeak={handleSpeak}
            initialSearchQuery={initialSearchQuery}
          />
        )}

        {activeTab === 'civic' && <CivicPage />}

        {activeTab === 'services' && (
          <ServicesPage
            services={services}
            tutorials={tutorials}
            onViewDetails={(service) => setSelectedServiceForDetail(service)}
          />
        )}

        {activeTab === 'emergency' && <EmergencyPage helplines={helplines} />}
      </main>

      {/* Modals & Slide-Overs */}
      {selectedSchemeForDetail && (
        <SchemeDetailModal
          scheme={selectedSchemeForDetail}
          onClose={() => setSelectedSchemeForDetail(null)}
          onOpenEligibility={(scheme) => {
            setSelectedSchemeForDetail(null);
            setSelectedSchemeForEligibility(scheme);
          }}
          isSaved={savedSchemeCodes.includes(selectedSchemeForDetail.code)}
          onToggleSave={handleToggleSaveScheme}
          onSpeak={handleSpeak}
          initialChecklistState={savedChecklists[selectedSchemeForDetail.code] || {}}
        />
      )}

      {selectedSchemeForEligibility && (
        <EligibilityModal
          scheme={selectedSchemeForEligibility}
          onClose={() => setSelectedSchemeForEligibility(null)}
        />
      )}

      {selectedServiceForDetail && (
        <ServiceDetailModal
          service={selectedServiceForDetail}
          tutorials={tutorials}
          onClose={() => setSelectedServiceForDetail(null)}
        />
      )}

      {/* Saved Tasks Drawer */}
      <SavedTasksDrawer
        isOpen={isTasksDrawerOpen}
        onClose={() => setIsTasksDrawerOpen(false)}
        savedSchemes={savedSchemesObjects}
        savedChecklists={savedChecklists}
        savedDrafts={savedDrafts}
        onRemoveScheme={handleRemoveSavedScheme}
        onOpenScheme={(scheme) => setSelectedSchemeForDetail(scheme)}
        onDeleteDraft={handleDeleteSavedDraft}
      />

      {/* Floating AI Assistant (Shared across platform) */}
      <FloatingAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpen={() => setIsAssistantOpen(true)}
        onTriggerAction={handleTriggerAssistantAction}
      />

      {/* Official Government Footer */}
      <Footer />
    </div>
  );
};

export default App;
