import React from 'react';
import {
  HelpCircle,
  Bookmark,
  Share2,
  ExternalLink,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import { ExamQuestion } from '../types/archive';

interface QuestionCardProps {
  question: ExamQuestion;
  isBookmarked: boolean;
  onToggleBookmark: (questionId: string) => void;
  onOpenParentPaper: (paperId: string) => void;
  onShareQuestion: (question: ExamQuestion) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isBookmarked,
  onToggleBookmark,
  onOpenParentPaper,
  onShareQuestion,
}) => {
  return (
    <article className="bg-white rounded-xl border border-stone-200 hover:border-amber-500/50 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4">
      {/* Header with tags & actions */}
      <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#540F1D] text-amber-200 border border-[#3D0A14]">
            Q {question.number}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            {question.type === 'CQ' ? 'Creative Question (সৃজনশীল)' : question.type === 'MCQ' ? 'MCQ (বহুনির্বাচনী)' : 'Short Answer'}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
            {question.subject} · {question.subjectBn}
          </span>
          <span className="text-xs text-stone-500 font-medium">
            {question.batch} · {question.quizRound}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'hover:bg-stone-100 border-transparent text-stone-400 hover:text-stone-600'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            aria-label="Bookmark question"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
          <button
            onClick={() => onShareQuestion(question)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Share Direct Question Link"
            aria-label="Share question link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stem / উদ্দীপক Callout */}
      {question.stem && (
        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-sm leading-relaxed bengali-text">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>উদ্দীপক / Context</span>
          </div>
          <div className="whitespace-pre-line font-medium text-stone-900">
            {question.stem}
          </div>
        </div>
      )}

      {/* Main Question Text */}
      <div className="text-stone-900 font-medium text-base sm:text-lg leading-relaxed bengali-text">
        {question.text}
      </div>

      {/* Sub-questions (e.g. ক, খ, গ, ঘ) */}
      {question.subQuestions && question.subQuestions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Sub-questions (উপ-প্রশ্নসমূহ):
          </div>
          <div className="space-y-1.5">
            {question.subQuestions.map((sub, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-amber-50/40 border border-amber-200/60 text-stone-900 text-sm bengali-text"
              >
                {sub}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multiple Choice Options (e.g. ক, খ, গ, ঘ) */}
      {question.options && question.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100">
          {question.options.map((opt, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-sm bengali-text hover:bg-stone-100 transition-colors"
            >
              <span className="font-semibold text-stone-900">{opt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Footer with Marks and View Paper Link */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div>
          {question.marks && (
            <span className="inline-flex items-center gap-1 font-semibold text-stone-700">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Marks: {question.marks}
            </span>
          )}
        </div>

        <button
          onClick={() => onOpenParentPaper(question.paperId)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#540F1D] hover:bg-[#6F1528] text-white font-medium text-xs transition-colors shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>View in Examination Paper</span>
        </button>
      </div>
    </article>
  );
};
