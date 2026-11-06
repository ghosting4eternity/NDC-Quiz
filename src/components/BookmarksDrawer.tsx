import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';
import { ExamPaper, ExamQuestion } from '../types/archive';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPapers: ExamPaper[];
  savedQuestions: ExamQuestion[];
  onSelectPaper: (paper: ExamPaper) => void;
  onSelectQuestion: (question: ExamQuestion) => void;
  onRemovePaperBookmark: (paperId: string) => void;
  onRemoveQuestionBookmark: (questionId: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedPapers,
  savedQuestions,
  onSelectPaper,
  onSelectQuestion,
  onRemovePaperBookmark,
  onRemoveQuestionBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const totalSaved = savedPapers.length + savedQuestions.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col border-l border-amber-900/30">
        {/* Header */}
        <div className="bg-[#480D19] text-white px-5 py-4 flex items-center justify-between border-b border-[#300710]">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-300 fill-amber-300" />
            <div>
              <h2 className="font-heading font-bold text-base text-white">Saved Collection</h2>
              <p className="text-xs text-amber-200/80">Stored locally in your browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close bookmarks drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {totalSaved === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500 space-y-3">
              <Bookmark className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-medium">No saved items yet.</p>
              <p className="text-xs text-stone-400 max-w-xs leading-normal">
                Click the bookmark icon on any examination paper or individual question to save it for quick reference.
              </p>
            </div>
          ) : (
            <>
              {/* Saved Examination Papers */}
              {savedPapers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#540F1D]" />
                      Examination Papers ({savedPapers.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {savedPapers.map((paper) => (
                      <div
                        key={paper.id}
                        className="bg-white p-3 rounded-xl border border-stone-200 hover:border-amber-400 transition-all shadow-xs flex items-center justify-between gap-3 group"
                      >
                        <div
                          onClick={() => {
                            onSelectPaper(paper);
                            onClose();
                          }}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#540F1D] text-amber-200">
                              {paper.batch}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {paper.quizRound}
                            </span>
                          </div>
                          <h4 className="font-heading font-semibold text-sm text-stone-900 group-hover:text-[#540F1D] truncate">
                            {paper.subject} <span className="bengali-text text-stone-500 text-xs">({paper.subjectBn})</span>
                          </h4>
                        </div>

                        <button
                          onClick={() => onRemovePaperBookmark(paper.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove from saved"
                          aria-label={`Remove ${paper.subject} from saved`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Questions */}
              {savedQuestions.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#540F1D]" />
                      Saved Questions ({savedQuestions.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {savedQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="bg-white p-3 rounded-xl border border-stone-200 hover:border-amber-400 transition-all shadow-xs flex items-center justify-between gap-3 group"
                      >
                        <div
                          onClick={() => {
                            onSelectQuestion(q);
                            onClose();
                          }}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#540F1D] text-amber-200">
                              Q {q.number}
                            </span>
                            <span className="text-[11px] text-amber-800 font-medium">
                              {q.subject}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {q.batch}
                            </span>
                          </div>
                          <p className="bengali-text text-xs text-stone-800 line-clamp-2 leading-relaxed">
                            {q.text}
                          </p>
                        </div>

                        <button
                          onClick={() => onRemoveQuestionBookmark(q.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove Question"
                          aria-label={`Remove question ${q.number} from saved`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {totalSaved > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-100 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-stone-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear All Saved Items
            </button>
            <span className="text-xs text-stone-400">
              {totalSaved} item{totalSaved > 1 ? 's' : ''} saved
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
