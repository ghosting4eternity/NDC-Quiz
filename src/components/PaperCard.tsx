import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  Bookmark,
  Share2,
  ExternalLink,
  Download,
  CheckCircle2,
  ListOrdered,
  Eye,
  Printer,
} from 'lucide-react';
import { ExamPaper } from '../types/archive';
import { printExamPaper } from '../utils/printPaper';

interface PaperCardProps {
  paper: ExamPaper;
  isBookmarked: boolean;
  onToggleBookmark: (paperId: string) => void;
  onSelectPaper: (paper: ExamPaper) => void;
  onShare: (paper: ExamPaper) => void;
  viewMode?: 'grid' | 'list';
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  isBookmarked,
  onToggleBookmark,
  onSelectPaper,
  onShare,
  viewMode = 'grid',
}) => {
  const groupColors: Record<string, string> = {
    Science: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Business Studies': 'bg-blue-50 text-blue-800 border-blue-200',
    Humanities: 'bg-amber-50 text-amber-800 border-amber-200',
    General: 'bg-stone-100 text-stone-800 border-stone-200',
  };

  const badgeColor = groupColors[paper.group] || groupColors.General;

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-stone-200 hover:border-amber-500/50 hover:shadow-md transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center ${
              paper.format === 'pdf'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {paper.format === 'pdf' ? (
              <FileText className="w-5 h-5" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#540F1D] text-amber-200 border border-[#3D0A14]">
                {paper.batch}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${badgeColor}`}>
                {paper.group}
              </span>
              <span className="text-xs font-medium text-stone-500">{paper.quizRound}</span>
              {paper.version === 'English Version' && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  EV
                </span>
              )}
              {paper.hasExtractedQuestions && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ListOrdered className="w-3 h-3" />
                  {paper.questionsCount} Questions
                </span>
              )}
            </div>

            <h3
              onClick={() => onSelectPaper(paper)}
              className="font-heading font-semibold text-stone-900 group-hover:text-[#6F1528] transition-colors truncate cursor-pointer text-base"
              title={paper.title}
            >
              {paper.subject} <span className="bengali-text text-stone-600 font-normal">({paper.subjectBn})</span>
            </h3>

            <p className="text-xs text-stone-500 truncate mt-0.5">
              Path: {paper.originalPath}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
          <button
            onClick={() => onToggleBookmark(paper.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'hover:bg-stone-100 border-stone-200 text-stone-500'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
            aria-label="Bookmark paper"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => onShare(paper)}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
            title="Share Direct Link"
            aria-label="Share paper"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => printExamPaper(paper)}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
            title="Print Paper / PDF"
            aria-label="Print examination paper"
          >
            <Printer className="w-4 h-4" />
          </button>

          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
            title="Download Original Paper"
            aria-label="Download original document"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={() => onSelectPaper(paper)}
            className="px-3 py-1.5 rounded-lg bg-[#540F1D] hover:bg-[#6F1528] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Paper</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-white rounded-xl border border-stone-200 hover:border-amber-500/60 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden relative">
      {/* Top Header Banner */}
      <div className="p-4 pb-3 border-b border-stone-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#540F1D] text-amber-200 border border-[#3D0A14]">
              {paper.batch}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${badgeColor}`}>
              {paper.group}
            </span>
            {paper.version === 'English Version' && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                EV
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(paper.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'hover:bg-stone-100 border-transparent text-stone-400 hover:text-stone-600'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
            aria-label="Bookmark paper"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        <h3
          onClick={() => onSelectPaper(paper)}
          className="font-heading font-bold text-stone-900 group-hover:text-[#6F1528] transition-colors text-lg leading-snug cursor-pointer line-clamp-2"
          title={paper.title}
        >
          {paper.subject}
        </h3>
        <p className="bengali-text text-stone-600 text-sm font-medium mt-0.5">
          {paper.subjectBn}
        </p>
      </div>

      {/* Middle Body */}
      <div className="p-4 pt-3 space-y-2.5 text-xs text-stone-600 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-stone-400">Quiz Round:</span>
          <span className="font-medium text-stone-800 text-right">{paper.quizRound}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-stone-400">Academic Year:</span>
          <span className="font-medium text-stone-800">{paper.yearLevel} · {paper.session}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-stone-400">Document Type:</span>
          <span className="inline-flex items-center gap-1 font-medium text-stone-800 uppercase text-[11px]">
            {paper.format === 'pdf' ? (
              <>
                <FileText className="w-3.5 h-3.5 text-red-600" /> PDF Paper
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-amber-700" /> Scanned Document
              </>
            )}
          </span>
        </div>

        {/* Verification Status */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified Source
          </span>

          {paper.hasExtractedQuestions ? (
            <span className="inline-flex items-center gap-1 font-semibold text-[#6F1528] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <ListOrdered className="w-3 h-3" />
              {paper.questionsCount} Digital Qs
            </span>
          ) : (
            <span className="text-stone-400">Original Only</span>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onShare(paper)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            title="Share Link"
            aria-label="Share paper link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => printExamPaper(paper)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            title="Print Paper / PDF"
            aria-label="Print paper"
          >
            <Printer className="w-4 h-4" />
          </button>
          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            title="Download Original"
            aria-label="Download original document"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={() => onSelectPaper(paper)}
          className="px-3.5 py-1.5 rounded-lg bg-[#540F1D] hover:bg-[#6F1528] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Paper</span>
        </button>
      </div>
    </div>
  );
};
