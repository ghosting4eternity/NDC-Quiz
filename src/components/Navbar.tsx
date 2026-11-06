import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Search,
  Settings,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  onOpenBookmarks: () => void;
  onOpenPreferences: () => void;
  onOpenQuickSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenBookmarks,
  onOpenPreferences,
  onOpenQuickSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', labelBn: 'মূলপাতা' },
    { id: 'archive', label: 'Complete Archive', labelBn: 'সম্পূর্ণ আর্কাইভ' },
    { id: 'subjects', label: 'Subjects', labelBn: 'বিষয়সমূহ' },
    { id: 'batches', label: 'Academic Batches', labelBn: 'শিক্ষাবর্ষ ও ব্যাচ' },
    { id: 'questions', label: 'Question Explorer', labelBn: 'প্রশ্ন অন্বেষণ' },
    { id: 'about', label: 'About', labelBn: 'পরিচিতি' },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#540F1D] text-stone-100 shadow-md border-b border-[#3D0A14] select-none">
      {/* Top micro-bar with motto & integrity guarantee */}
      <div className="bg-[#3D0A14] text-stone-300 text-xs py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide text-[11px] sm:text-xs truncate min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
            <span className="truncate">
              Notre Dame College, Dhaka <span className="hidden sm:inline">· Digital Repository of Weekly Examination Questions</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-stone-400 shrink-0">
            <span className="text-amber-300/90 font-semibold tracking-wider text-[11px] uppercase">
              Preserve · Organize · Discover
            </span>
            <span className="text-stone-500">|</span>
            <a
              href="https://drive.google.com/drive/folders/1BW0InS-rnlLd3VienUaQLoKm14dj_ZEA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors text-stone-300 text-[11px]"
              title="Open Primary Google Drive Archive"
            >
              <span>Source Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Identity / Shield Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1 min-w-0"
            aria-label="NDC Quiz Archive Homepage"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-md bg-stone-900/40 border border-amber-400/40 p-0.5 sm:p-1 flex items-center justify-center shadow-inner group-hover:border-amber-300 transition-all shrink-0">
              <div className="w-full h-full bg-[#6B1426] rounded flex flex-col items-center justify-center text-amber-200 shadow-sm border border-amber-500/20">
                <span className="font-heading font-bold text-[10px] sm:text-xs tracking-tight text-amber-300">NDC</span>
                <span className="text-[7px] sm:text-[8px] font-sans text-amber-100/80 -mt-0.5 tracking-widest font-semibold">1949</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-sm sm:text-lg lg:text-xl tracking-tight text-white group-hover:text-amber-200 transition-colors truncate">
                  NDC Quiz Archive
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  Archive
                </span>
              </div>
              <p className="text-[11px] text-amber-100/70 font-sans tracking-normal hidden md:block truncate">
                নটর ডেম কলেজ সাপ্তাহিক পরীক্ষা সংগ্রহশালা
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-white bg-[#6F1528] shadow-sm font-semibold'
                      : 'text-stone-200 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Quick Search Button */}
            <button
              onClick={onOpenQuickSearch}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[#420B16] hover:bg-[#601221] border border-amber-500/20 hover:border-amber-400/40 text-stone-200 hover:text-white rounded-lg text-xs font-medium transition-all shadow-sm"
              title="Quick Search Archive (Ctrl+K)"
              aria-label="Open Search"
            >
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/30 border border-white/10 rounded text-stone-300">
                ⌘K
              </kbd>
            </button>

            {/* Bookmarks Toggle */}
            <button
              onClick={onOpenBookmarks}
              className={`relative p-2 rounded-lg text-stone-200 hover:text-white transition-colors border ${
                savedCount > 0
                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                  : 'hover:bg-white/5 border-transparent'
              }`}
              title="Saved Questions & Papers"
              aria-label={`View ${savedCount} saved items`}
            >
              <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-stone-950 rounded-full shadow-sm">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Reading Preferences (desktop only) */}
            <button
              onClick={onOpenPreferences}
              className="hidden sm:block p-2 rounded-lg text-stone-200 hover:text-white hover:bg-white/5 border border-transparent transition-colors"
              title="Reading Preferences"
              aria-label="Adjust reading preferences"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-200 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#420B16] border-t border-[#300710] px-4 pt-3 pb-5 space-y-1 shadow-xl">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#6F1528] text-white font-semibold'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-amber-300/80 font-normal">{item.labelBn}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10 mt-2 space-y-1">
            <button
              onClick={() => {
                onOpenPreferences();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium text-stone-300 hover:bg-white/5"
            >
              <Settings className="w-4 h-4 text-amber-300" />
              <span>Reading Preferences (Text size & Layout)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 mt-1 flex items-center justify-between text-xs text-stone-400">
            <span>960 Historical Exam Records</span>
            <a
              href="https://drive.google.com/drive/folders/1BW0InS-rnlLd3VienUaQLoKm14dj_ZEA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:underline flex items-center gap-1"
            >
              Google Drive Folder <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
