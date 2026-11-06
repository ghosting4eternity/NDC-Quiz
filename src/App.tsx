/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Grid,
  List,
  Layers,
  Calendar,
  Bookmark,
  Share2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ExternalLink,
  HelpCircle,
  FileText,
  Award,
  CheckCircle2,
  ArrowRight,
  Check,
} from 'lucide-react';

import { allPapers, allExtractedQuestions, subjectSummaries, batchSummaries } from './data/papers';
import {
  ExamPaper,
  ExamQuestion,
  FilterState,
  ReadingPreferences,
  BookmarkStore,
} from './types/archive';
import {
  filterPapers,
  sortPapers,
  filterQuestions,
  calculateArchiveStats,
} from './utils/searchAndFilter';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { PaperCard } from './components/PaperCard';
import { QuestionCard } from './components/QuestionCard';
import { PaperViewerModal } from './components/PaperViewerModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { ReadingPreferencesModal } from './components/ReadingPreferencesModal';
import { SubjectDirectory } from './components/SubjectDirectory';
import { AcademicYearDirectory } from './components/AcademicYearDirectory';
import { AboutView } from './components/AboutView';
import { QuickSearchModal } from './components/QuickSearchModal';

const ITEMS_PER_PAGE = 24;

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Filter State for Archive
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    batch: 'all',
    group: 'all',
    subject: 'all',
    version: 'all',
    yearLevel: 'all',
    format: 'all',
    hasExtractedQuestionsOnly: false,
    sortBy: 'newest',
  });

  // Archive view layout
  const [archiveViewMode, setArchiveViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Question Explorer Filters
  const [qQuery, setQQuery] = useState<string>('');
  const [qSubject, setQSubject] = useState<string>('all');
  const [qBatch, setQBatch] = useState<string>('all');
  const [qGroup, setQGroup] = useState<string>('all');
  const [qType, setQType] = useState<string>('all');

  // Active Selected Paper (for Viewer Modal)
  const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null);

  // Modals & Drawers
  const [bookmarksDrawerOpen, setBookmarksDrawerOpen] = useState<boolean>(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState<boolean>(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookmarks state (persisted)
  const [bookmarks, setBookmarks] = useState<BookmarkStore>(() => {
    try {
      const stored = localStorage.getItem('ndc_quiz_bookmarks');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return { savedPaperIds: [], savedQuestionIds: [] };
  });

  // Reading preferences (persisted)
  const [preferences, setPreferences] = useState<ReadingPreferences>(() => {
    try {
      const stored = localStorage.getItem('ndc_quiz_prefs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return {
      fontSize: 'medium',
      readingWidth: 'standard',
      preferViewMode: 'split',
    };
  });

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ndc_quiz_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      // ignore
    }
  }, [bookmarks]);

  // Sync Preferences to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ndc_quiz_prefs', JSON.stringify(preferences));
    } catch (e) {
      // ignore
    }
  }, [preferences]);

  // Handle URL Hash for Direct Deep-linking (#paper=..., #question=..., #tab=...)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.startsWith('#paper=')) {
        const pId = hash.replace('#paper=', '');
        const found = allPapers.find((p) => p.id === pId || p.fileId === pId);
        if (found) {
          setSelectedPaper(found);
        }
      } else if (hash.startsWith('#question=')) {
        const qId = hash.replace('#question=', '');
        const q = allExtractedQuestions.find((item) => item.id === qId);
        if (q) {
          const parent = allPapers.find((p) => p.id === q.paperId);
          if (parent) {
            setSelectedPaper(parent);
          }
        }
      } else if (hash.startsWith('#tab=')) {
        const tab = hash.replace('#tab=', '').split('&')[0];
        if (['home', 'archive', 'subjects', 'batches', 'questions', 'about'].includes(tab)) {
          setCurrentTab(tab);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Keyboard shortcut for Quick Search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Toggle Bookmark for Paper
  const handleTogglePaperBookmark = (paperId: string) => {
    setBookmarks((prev) => {
      const exists = prev.savedPaperIds.includes(paperId);
      const updated = exists
        ? prev.savedPaperIds.filter((id) => id !== paperId)
        : [...prev.savedPaperIds, paperId];
      showToast(exists ? 'Paper removed from saved collection' : 'Paper saved to collection');
      return { ...prev, savedPaperIds: updated };
    });
  };

  // Toggle Bookmark for Question
  const handleToggleQuestionBookmark = (questionId: string) => {
    setBookmarks((prev) => {
      const exists = prev.savedQuestionIds.includes(questionId);
      const updated = exists
        ? prev.savedQuestionIds.filter((id) => id !== questionId)
        : [...prev.savedQuestionIds, questionId];
      showToast(exists ? 'Question removed from saved collection' : 'Question saved to collection');
      return { ...prev, savedQuestionIds: updated };
    });
  };

  // Share Paper
  const handleSharePaper = (paper: ExamPaper) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#paper=${paper.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Direct link to paper copied to clipboard!');
      });
    } else {
      showToast(shareUrl);
    }
  };

  // Share Question
  const handleShareQuestion = (question: ExamQuestion) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#question=${question.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Direct link to question copied to clipboard!');
      });
    } else {
      showToast(shareUrl);
    }
  };

  // Archive Statistics
  const archiveStats = useMemo(() => calculateArchiveStats(allPapers), []);

  // Featured recent papers with high digital question coverage
  const featuredPapers = useMemo(() => {
    const withQuestions = allPapers.filter((p) => p.hasExtractedQuestions);
    const recent = allPapers.filter((p) => !p.hasExtractedQuestions && p.batchNumber >= 26);
    return [...withQuestions, ...recent].slice(0, 8);
  }, []);

  // Filtered Archive Papers
  const filteredPapers = useMemo(() => {
    const result = filterPapers(allPapers, filters);
    return sortPapers(result, filters.sortBy);
  }, [filters]);

  // Paginated Archive Papers
  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE) || 1;
  const paginatedPapers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPapers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPapers, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filtered Questions in Question Explorer
  const filteredQuestions = useMemo(() => {
    return filterQuestions(allExtractedQuestions, qQuery, qSubject, qBatch, qGroup, qType);
  }, [qQuery, qSubject, qBatch, qGroup, qType]);

  // Saved items objects
  const savedPapersList = useMemo(
    () => allPapers.filter((p) => bookmarks.savedPaperIds.includes(p.id)),
    [bookmarks.savedPaperIds]
  );
  const savedQuestionsList = useMemo(
    () => allExtractedQuestions.filter((q) => bookmarks.savedQuestionIds.includes(q.id)),
    [bookmarks.savedQuestionIds]
  );
  const totalSavedCount = savedPapersList.length + savedQuestionsList.length;

  // Handler to jump to subject in Archive
  const handleSelectSubject = (subjectName: string) => {
    setFilters((prev) => ({
      ...prev,
      subject: subjectName,
      searchQuery: '',
      group: 'all',
      batch: 'all',
    }));
    setCurrentTab('archive');
  };

  // Handler to jump to batch in Archive
  const handleSelectBatch = (batchName: string) => {
    setFilters((prev) => ({
      ...prev,
      batch: batchName,
      searchQuery: '',
      subject: 'all',
      group: 'all',
    }));
    setCurrentTab('archive');
  };

  // Clear all archive filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      batch: 'all',
      group: 'all',
      subject: 'all',
      version: 'all',
      yearLevel: 'all',
      format: 'all',
      hasExtractedQuestionsOnly: false,
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.batch !== 'all' ||
    filters.group !== 'all' ||
    filters.subject !== 'all' ||
    filters.version !== 'all' ||
    filters.yearLevel !== 'all' ||
    filters.format !== 'all' ||
    filters.hasExtractedQuestionsOnly;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-stone-900 font-sans overflow-x-hidden w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#320811] text-amber-200 border border-amber-400/40 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-medium animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={totalSavedCount}
        onOpenBookmarks={() => setBookmarksDrawerOpen(true)}
        onOpenPreferences={() => setPreferencesModalOpen(true)}
        onOpenQuickSearch={() => setQuickSearchOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* TAB: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-16 pb-16">
            {/* Hero Section with stats and search */}
            <HeroSection
              onSearch={(q) => {
                setFilters((prev) => ({ ...prev, searchQuery: q }));
              }}
              onSelectGroup={(grp) => {
                setFilters((prev) => ({ ...prev, group: grp }));
              }}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              stats={archiveStats}
            />

            {/* Featured Recent Papers from Google Drive */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-stone-900 tracking-tight">
                    Recently Added Examination Papers
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-sans">
                    Authentic weekly quiz papers cataloged from NDC historical batches
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('archive')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#540F1D] hover:underline"
                >
                  <span>View All 960 Papers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid of sample papers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredPapers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isBookmarked={bookmarks.savedPaperIds.includes(paper.id)}
                    onToggleBookmark={handleTogglePaperBookmark}
                    onSelectPaper={(p) => setSelectedPaper(p)}
                    onShare={handleSharePaper}
                  />
                ))}
              </div>
            </div>

            {/* Question Explorer Spotlight */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-stone-100 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                      Authentic Question Bank
                    </span>
                    <h3 className="font-heading font-extrabold text-2xl text-stone-900">
                      Explore Individual Questions Verbatim
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                      Search and explore original Creative Questions (সৃজনশীল) and MCQs across Physics,
                      Chemistry, Higher Mathematics, Bangla, English, ICT, and Commerce subjects.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('questions')}
                    className="px-5 py-2.5 bg-[#540F1D] hover:bg-[#6F1528] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-2 shrink-0"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-300" />
                    <span>Open Question Explorer</span>
                  </button>
                </div>

                {/* Question Cards Spotlight */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allExtractedQuestions.slice(0, 3).map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      isBookmarked={bookmarks.savedQuestionIds.includes(q.id)}
                      onToggleBookmark={handleToggleQuestionBookmark}
                      onOpenParentPaper={(pId) => {
                        const parent = allPapers.find((p) => p.id === pId);
                        if (parent) setSelectedPaper(parent);
                      }}
                      onShareQuestion={handleShareQuestion}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Browse by Academic Batches */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-stone-900 tracking-tight">
                    Explore by Academic Batch
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Chronological navigation across Notre Dame College historical cohorts
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('batches')}
                  className="text-xs font-semibold text-[#540F1D] hover:underline flex items-center gap-1"
                >
                  <span>All Batches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {batchSummaries.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => handleSelectBatch(b.name)}
                    className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
                  >
                    <div>
                      <span className="font-heading font-bold text-base text-stone-900 group-hover:text-[#540F1D] transition-colors block">
                        {b.name}
                      </span>
                      <span className="text-[11px] text-stone-400 block mt-0.5 truncate">
                        {b.session.split(' ')[0]}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-stone-100 mt-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-600">{b.paperCount}</span>
                      <span className="text-[10px] text-stone-400">Papers</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: COMPLETE ARCHIVE */}
        {currentTab === 'archive' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Archive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
                    Central Repository
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    960 Examination Records
                  </span>
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-900 tracking-tight">
                  Complete Historical Archive
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Browse, search, and filter all historical NDC weekly Quiz examination papers.
                </p>
              </div>

              {/* View Layout Controls & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-white rounded-xl border border-stone-200 p-1 shadow-xs">
                  <button
                    onClick={() => setArchiveViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      archiveViewMode === 'grid'
                        ? 'bg-[#540F1D] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Grid View"
                    aria-label="Switch to grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setArchiveViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      archiveViewMode === 'list'
                        ? 'bg-[#540F1D] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="List View"
                    aria-label="Switch to list view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500 hidden sm:inline">Sort:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as FilterState['sortBy'],
                      }))
                    }
                    className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#540F1D]"
                    aria-label="Sort examination papers"
                  >
                    <option value="newest">Newest Batches First</option>
                    <option value="oldest">Oldest Batches First</option>
                    <option value="subject_asc">Subject (A to Z)</option>
                    <option value="subject_desc">Subject (Z to A)</option>
                    <option value="questions_count">Most Digital Questions</option>
                  </select>
                </div>

                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`lg:hidden px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    sidebarOpen
                      ? 'bg-[#540F1D] text-white border-transparent'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Layout: Sidebar + Grid */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Filter Sidebar */}
              <aside
                className={`w-full lg:w-72 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-6 shrink-0 ${
                  sidebarOpen ? 'block' : 'hidden lg:block'
                }`}
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-stone-900">
                    <SlidersHorizontal className="w-4 h-4 text-[#540F1D]" />
                    <span>Filter Archive</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] font-semibold text-[#540F1D] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* Search in Archive */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Keyword Search</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={filters.searchQuery}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                      }
                      placeholder="e.g. Physics, ভেক্টর..."
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#540F1D]"
                    />
                  </div>
                </div>

                {/* Batch Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Academic Batch</label>
                  <select
                    value={filters.batch}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, batch: e.target.value }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#540F1D]"
                  >
                    <option value="all">All Batches (960 papers)</option>
                    {batchSummaries.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.paperCount} papers)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Group Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Academic Group</label>
                  <select
                    value={filters.group}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, group: e.target.value }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#540F1D]"
                  >
                    <option value="all">All Groups</option>
                    <option value="Science">Science (বিজ্ঞান)</option>
                    <option value="Business Studies">Business Studies (ব্যবসায় শিক্ষা)</option>
                    <option value="Humanities">Humanities (মানবিক)</option>
                    <option value="General">General / Language (সাধারণ)</option>
                  </select>
                </div>

                {/* Subject Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Subject</label>
                  <select
                    value={filters.subject}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#540F1D]"
                  >
                    <option value="all">All Subjects (18)</option>
                    {subjectSummaries.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({s.paperCount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medium / Version Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Medium / Version</label>
                  <select
                    value={filters.version}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, version: e.target.value }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#540F1D]"
                  >
                    <option value="all">All Versions</option>
                    <option value="Bangla Version">Bangla Version (BV)</option>
                    <option value="English Version">English Version (EV)</option>
                  </select>
                </div>

                {/* Document Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Document Format</label>
                  <select
                    value={filters.format}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, format: e.target.value }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#540F1D]"
                  >
                    <option value="all">All Formats</option>
                    <option value="image">Scanned Image (JPG / PNG)</option>
                    <option value="pdf">PDF Document</option>
                  </select>
                </div>

                {/* Extracted Questions Checkbox */}
                <div className="pt-2 border-t border-stone-100">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.hasExtractedQuestionsOnly}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          hasExtractedQuestionsOnly: e.target.checked,
                        }))
                      }
                      className="rounded text-[#540F1D] focus:ring-[#540F1D] w-4 h-4"
                    />
                    <span className="text-xs font-medium text-stone-700">
                      With Transcribed Digital Questions Only
                    </span>
                  </label>
                </div>
              </aside>

              {/* Main Papers Display */}
              <div className="flex-1 w-full space-y-6">
                {/* Result count & active chips */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="text-xs text-stone-600 font-medium">
                    Showing <strong className="text-stone-900">{filteredPapers.length}</strong> of{' '}
                    {allPapers.length} examination papers
                    {hasActiveFilters && ' (filtered)'}
                  </div>

                  {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {filters.searchQuery && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs">
                          Query: &ldquo;{filters.searchQuery}&rdquo;
                          <button
                            onClick={() =>
                              setFilters((prev) => ({ ...prev, searchQuery: '' }))
                            }
                            className="hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.batch !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs">
                          {filters.batch}
                          <button
                            onClick={() => setFilters((prev) => ({ ...prev, batch: 'all' }))}
                            className="hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.subject !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs">
                          {filters.subject}
                          <button
                            onClick={() =>
                              setFilters((prev) => ({ ...prev, subject: 'all' }))
                            }
                            className="hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.group !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs">
                          {filters.group}
                          <button
                            onClick={() => setFilters((prev) => ({ ...prev, group: 'all' }))}
                            className="hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      <button
                        onClick={handleResetFilters}
                        className="text-xs text-[#540F1D] font-semibold hover:underline ml-1"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                {/* Empty State */}
                {paginatedPapers.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                    <Search className="w-12 h-12 text-stone-300 mx-auto" />
                    <h3 className="font-heading font-bold text-lg text-stone-800">
                      No examination papers found
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                      No records matched the selected filters. Try broadening your criteria or reset
                      filters to view all 960 papers.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-[#540F1D] text-white text-xs font-semibold rounded-xl hover:bg-[#6F1528] transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Papers Cards List/Grid */}
                    <div
                      className={
                        archiveViewMode === 'grid'
                          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                          : 'space-y-3'
                      }
                    >
                      {paginatedPapers.map((paper) => (
                        <PaperCard
                          key={paper.id}
                          paper={paper}
                          isBookmarked={bookmarks.savedPaperIds.includes(paper.id)}
                          onToggleBookmark={handleTogglePaperBookmark}
                          onSelectPaper={(p) => setSelectedPaper(p)}
                          onShare={handleSharePaper}
                          viewMode={archiveViewMode}
                        />
                      ))}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mt-8">
                        <div className="text-xs text-stone-500">
                          Page <strong className="text-stone-900">{currentPage}</strong> of{' '}
                          {totalPages} ({filteredPapers.length} total papers)
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setCurrentPage((p) => Math.max(p - 1, 1));
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                          </button>

                          {/* Quick page numbers */}
                          <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                              const pageNum = i + 1;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => {
                                    setCurrentPage(pageNum);
                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                  }}
                                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                                    currentPage === pageNum
                                      ? 'bg-[#540F1D] text-white font-bold'
                                      : 'hover:bg-stone-100 text-stone-700'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                            {totalPages > 5 && <span className="text-stone-400 px-1">...</span>}
                          </div>

                          <button
                            onClick={() => {
                              setCurrentPage((p) => Math.min(p + 1, totalPages));
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SUBJECTS DIRECTORY */}
        {currentTab === 'subjects' && (
          <SubjectDirectory onSelectSubject={handleSelectSubject} />
        )}

        {/* TAB: ACADEMIC BATCHES */}
        {currentTab === 'batches' && (
          <AcademicYearDirectory onSelectBatch={handleSelectBatch} />
        )}

        {/* TAB: QUESTION EXPLORER */}
        {currentTab === 'questions' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#540F1D] bg-amber-100 px-2.5 py-0.5 rounded">
                  Item Bank
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  {allExtractedQuestions.length} Authentically Cataloged Questions
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-900 tracking-tight">
                Historical Question Explorer
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Search individual questions across past examination papers without answering or alteration.
              </p>
            </div>

            {/* Question Filter & Search Header */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={qQuery}
                  onChange={(e) => setQQuery(e.target.value)}
                  placeholder="Search question text, formulas, stems (e.g. ভেক্টর, প্যাশন, অমিত, সমীকরণ, PPC)..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#540F1D] text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-xs">
                <select
                  value={qSubject}
                  onChange={(e) => setQSubject(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-800"
                >
                  <option value="all">All Subjects</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Higher Mathematics">Higher Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Bangla">Bangla</option>
                  <option value="English">English</option>
                  <option value="ICT">ICT</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Economics">Economics</option>
                </select>

                <select
                  value={qBatch}
                  onChange={(e) => setQBatch(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-800"
                >
                  <option value="all">All Batches</option>
                  <option value="Batch 26">Batch 26</option>
                  <option value="Batch 24">Batch 24</option>
                </select>

                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-800"
                >
                  <option value="all">All Question Types</option>
                  <option value="CQ">Creative Question (সৃজনশীল)</option>
                  <option value="MCQ">MCQ (বহুনির্বাচনী)</option>
                  <option value="Short">Short Answer</option>
                </select>

                <button
                  onClick={() => {
                    setQQuery('');
                    setQSubject('all');
                    setQBatch('all');
                    setQGroup('all');
                    setQType('all');
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Questions Results Count */}
            <div className="text-xs text-stone-500 font-medium">
              Found <strong className="text-stone-900">{filteredQuestions.length}</strong> matching questions
            </div>

            {/* Questions Grid */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-heading font-bold text-base text-stone-800">No questions found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try searching for different terms or select &ldquo;All Subjects&rdquo;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    isBookmarked={bookmarks.savedQuestionIds.includes(q.id)}
                    onToggleBookmark={handleToggleQuestionBookmark}
                    onOpenParentPaper={(pId) => {
                      const parent = allPapers.find((p) => p.id === pId);
                      if (parent) setSelectedPaper(parent);
                    }}
                    onShareQuestion={handleShareQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: ABOUT */}
        {currentTab === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* MODAL: Paper Viewer (Split / Digital / Original) */}
      {selectedPaper && (
        <PaperViewerModal
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
          isBookmarked={bookmarks.savedPaperIds.includes(selectedPaper.id)}
          onToggleBookmark={handleTogglePaperBookmark}
          onShare={handleSharePaper}
          preferences={preferences}
        />
      )}

      {/* MODAL: Reading Preferences */}
      <ReadingPreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={(partial) => setPreferences((p) => ({ ...p, ...partial }))}
      />

      {/* DRAWER: Bookmarks */}
      <BookmarksDrawer
        isOpen={bookmarksDrawerOpen}
        onClose={() => setBookmarksDrawerOpen(false)}
        savedPapers={savedPapersList}
        savedQuestions={savedQuestionsList}
        onSelectPaper={(p) => setSelectedPaper(p)}
        onSelectQuestion={(q) => {
          const parent = allPapers.find((p) => p.id === q.paperId);
          if (parent) setSelectedPaper(parent);
        }}
        onRemovePaperBookmark={handleTogglePaperBookmark}
        onRemoveQuestionBookmark={handleToggleQuestionBookmark}
        onClearAll={() => {
          setBookmarks({ savedPaperIds: [], savedQuestionIds: [] });
          showToast('Cleared all saved items');
        }}
      />

      {/* MODAL: Quick Omni-Search */}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        papers={allPapers}
        questions={allExtractedQuestions}
        onSelectPaper={(p) => setSelectedPaper(p)}
        onSelectQuestion={(q) => {
          const parent = allPapers.find((p) => p.id === q.paperId);
          if (parent) setSelectedPaper(parent);
        }}
        onSearchArchive={(q) => {
          setFilters((prev) => ({ ...prev, searchQuery: q }));
          setCurrentTab('archive');
        }}
      />
    </div>
  );
}
