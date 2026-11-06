import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Layers,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { AcademicGroup } from '../types/archive';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onSelectGroup: (group: AcademicGroup | 'all') => void;
  onSelectTab: (tab: string) => void;
  stats: {
    totalPapers: number;
    batches: number;
    subjects: number;
    totalExtractedQuestions: number;
    pdfCount: number;
    imageCount: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectGroup,
  onSelectTab,
  stats,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onSelectTab('archive');
    }
  };

  const quickPills = [
    { label: 'Physics', query: 'Physics' },
    { label: 'Chemistry', query: 'Chemistry' },
    { label: 'Higher Math', query: 'Higher Mathematics' },
    { label: 'Biology', query: 'Biology' },
    { label: 'Bangla', query: 'Bangla' },
    { label: 'English', query: 'English' },
    { label: 'ICT', query: 'ICT' },
    { label: 'Accounting', query: 'Accounting' },
    { label: 'Economics', query: 'Economics' },
    { label: 'Batch 26', query: 'Batch 26' },
    { label: 'Batch 25', query: 'Batch 25' },
    { label: 'Batch 24', query: 'Batch 24' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#500D1B] via-[#400A15] to-[#2B050E] text-white pt-12 pb-16 px-4 sm:px-6 border-b border-amber-900/30">
      {/* Subtle academic background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Archival Shield Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/40 border border-amber-400/30 text-amber-300 text-xs font-medium tracking-wide shadow-sm">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>The Official Student Repository of Historical NDC Weekly Quizzes</span>
        </div>

        {/* Main Title & Tagline */}
        <div className="space-y-3">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Every week&apos;s questions, <br className="hidden sm:block" />
            <span className="text-amber-300 underline decoration-amber-500/40 decoration-wavy underline-offset-8">
              organized in one place.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-stone-200/90 font-sans leading-relaxed">
            An organized digital archive of Notre Dame College&apos;s historical weekly Quiz examination papers.
            Explore past papers, discover questions by subject, and access authentic academic records.
          </p>
        </div>

        {/* Central Search Form */}
        <div className="max-w-2xl mx-auto pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-stone-900/80 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border-2 border-amber-500/40 shadow-2xl focus-within:border-amber-400 transition-all"
          >
            <div className="pl-2 sm:pl-3 text-amber-400 shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by subject, year, round, or question text..."
              className="w-full bg-transparent px-2 sm:px-3 py-2 sm:py-2.5 text-stone-100 placeholder-stone-400 focus:outline-none text-xs sm:text-base min-w-0"
              aria-label="Search examination papers and questions"
            />
            <button
              type="submit"
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-1.5 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>

          {/* Quick pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-stone-300">
            <span className="text-stone-400 font-medium">Quick Explore:</span>
            {quickPills.slice(0, 8).map((pill) => (
              <button
                key={pill.label}
                onClick={() => {
                  onSearch(pill.query);
                  onSelectTab('archive');
                }}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-amber-500/20 hover:text-amber-200 text-stone-300 border border-white/10 hover:border-amber-400/30 transition-all text-[11px]"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSelectTab('archive')}
            className="px-5 py-2.5 rounded-xl bg-[#6F1528] hover:bg-[#851930] text-white border border-amber-500/30 font-medium text-sm transition-all shadow flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Explore Complete Archive</span>
          </button>
          <button
            onClick={() => onSelectTab('subjects')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-100 border border-white/15 font-medium text-sm transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>Browse Subjects (18)</span>
          </button>
          <button
            onClick={() => onSelectTab('questions')}
            className="px-5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/30 font-medium text-sm transition-all flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Question Explorer ({stats.totalExtractedQuestions}+ Cataloged)</span>
          </button>
        </div>

        {/* Authentic Live Archive Stats Ribbon */}
        <div className="pt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-300">
                {stats.totalPapers}
              </div>
              <div className="text-xs text-stone-300 font-medium mt-0.5">Historical Papers</div>
              <div className="text-[10px] text-stone-400">PDFs & Scanned Records</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-300">
                {stats.batches}
              </div>
              <div className="text-xs text-stone-300 font-medium mt-0.5">Academic Batches</div>
              <div className="text-[10px] text-stone-400">From Batch 17 to Batch 28</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-300">
                {stats.subjects}
              </div>
              <div className="text-xs text-stone-300 font-medium mt-0.5">Disciplines & Subjects</div>
              <div className="text-[10px] text-stone-400">Science, Commerce, Arts</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-300">
                {stats.totalExtractedQuestions}
              </div>
              <div className="text-xs text-stone-300 font-medium mt-0.5">Indexed Questions</div>
              <div className="text-[10px] text-stone-400">Verbatim Unaltered Text</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
