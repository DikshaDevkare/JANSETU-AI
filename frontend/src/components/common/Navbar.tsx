import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  FileCheck2,
  PhoneCall,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAssistant
}) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: 'schemes', label: t('nav_schemes'), icon: FileText },
    { id: 'civic', label: t('nav_civic'), icon: AlertTriangle },
    { id: 'services', label: t('nav_services'), icon: FileCheck2 },
    { id: 'emergency', label: t('nav_emergency'), icon: PhoneCall, isAlert: true }
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* National Emblem & AI Emblem badge */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gov-navy to-gov-navyLight flex items-center justify-center text-white shadow-md border border-gov-navyLight/40 group-hover:scale-105 transition duration-200">
              <span className="font-serif font-black text-lg text-amber-400">JS</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gov-navy tracking-tight font-serif">
                  JANSETU <span className="text-gov-saffron font-sans">AI</span>
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Official MVP
                </span>
              </div>
              <div className="text-[11px] text-gov-textMuted font-medium tracking-tight">
                One Platform. Every Citizen. Clear Next Steps.
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 ${
                    item.isAlert
                      ? isActive
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                      : isActive
                      ? 'bg-gov-navy text-white shadow-sm'
                      : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isAlert ? 'text-red-600' : 'text-gov-navy'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAssistant}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-gov-navy font-bold text-xs shadow-sm hover:shadow transition border border-amber-300 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-gov-navy group-hover:rotate-12 transition" />
              <span>JanSetu Mitra AI</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={onOpenAssistant}
              className="p-2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-gov-navy hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-gov-navy text-white font-bold'
                    : item.isAlert
                    ? 'text-red-700 bg-red-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.isAlert ? 'text-red-600' : 'text-gov-navy'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
