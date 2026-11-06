import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Layers, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import { ExamPaper, ExamQuestion } from '../types/archive';
import { matchesPaper, filterQuestions } from '../utils/searchAndFilter';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  papers: ExamPaper[];
  questions: ExamQuestion[];
  onSelectPaper: (paper: ExamPaper) => void;
  onSelectQuestion: (question: ExamQuestion) => void;
  onSearchArchive: (query: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  papers,
  questions,
  onSelectPaper,
  onSelectQuestion,
  onSearchArchive,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim();
  const matchingPapers = trimmed ? papers.filter((p) => matchesPaper(p, trimmed)).slice(0, 5) : [];
  const matchingQuestions = trimmed
    ? filterQuestions(questions, trimmed, 'all', 'all', 'all', 'all').slice(0, 4)
    : [];

  const handleFullSearch = () => {
    if (trimmed) {
      onSearchArchive(trimmed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFullSearch();
            }}
            placeholder="Search across all 960 papers and questions (Bengali or English)..."
            className="w-full bg-transparent focus:outline-none text-base text-stone-900 placeholder-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-stone-500 hover:text-stone-800 bg-stone-200/60 hover:bg-stone-200 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!trimmed ? (
            <div className="p-6 text-center text-stone-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm">Type any keyword to search historical examination records.</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs">
                <span className="text-stone-500">Popular:</span>
                {['Physics', 'Chemistry', 'Higher Mathematics', 'ভেক্টর', 'Batch 26', 'Accounting'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-600 border border-stone-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : matchingPapers.length === 0 && matchingQuestions.length === 0 ? (
            <div className="p-8 text-center text-stone-500 space-y-2">
              <p className="text-sm font-medium">No direct matches for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-stone-400">
                Try searching for a subject name, batch (e.g. Batch 26), or specific Bangla terms.
              </p>
              <button
                onClick={handleFullSearch}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#540F1D] text-white text-xs font-semibold rounded-xl hover:bg-[#6F1528] transition-colors"
              >
                <span>Search in Full Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Matching Papers */}
              {matchingPapers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#540F1D]" />
                    <span>Matching Examination Papers</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingPapers.map((paper) => (
                      <div
                        key={paper.id}
                        onClick={() => {
                          onSelectPaper(paper);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-400/60 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#540F1D] text-amber-200">
                              {paper.batch}
                            </span>
                            <span className="text-xs font-medium text-stone-500">
                              {paper.quizRound}
                            </span>
                          </div>
                          <div className="font-heading font-semibold text-sm text-stone-900 group-hover:text-[#540F1D] truncate">
                            {paper.subject} <span className="bengali-text text-stone-600 font-normal">({paper.subjectBn})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#540F1D] shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Questions */}
              {matchingQuestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#540F1D]" />
                    <span>Matching Individual Questions</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingQuestions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          onSelectQuestion(q);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-400/60 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#540F1D] text-amber-200">
                              Q {q.number}
                            </span>
                            <span className="text-xs font-semibold text-amber-800">
                              {q.subject}
                            </span>
                            <span className="text-xs text-stone-400">
                              {q.batch} · {q.quizRound}
                            </span>
                          </div>
                          <p className="bengali-text text-xs text-stone-800 line-clamp-2">
                            {q.text}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#540F1D] shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {trimmed && (
          <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span>Press Enter to search full archive</span>
            <button
              onClick={handleFullSearch}
              className="px-3 py-1 bg-[#540F1D] hover:bg-[#6F1528] text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <span>View All Results</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
