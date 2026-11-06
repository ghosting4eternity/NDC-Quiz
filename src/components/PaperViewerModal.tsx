import React, { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Printer,
  Bookmark,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Columns,
  Eye,
  ListOrdered,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { ExamPaper, ReadingPreferences } from '../types/archive';
import { printExamPaper, printOriginalDocument } from '../utils/printPaper';
import { PracticeTimerOverlay } from './PracticeTimerOverlay';

interface PaperViewerModalProps {
  paper: ExamPaper;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (paperId: string) => void;
  onShare: (paper: ExamPaper) => void;
  preferences: ReadingPreferences;
}

export const PaperViewerModal: React.FC<PaperViewerModalProps> = ({
  paper,
  onClose,
  isBookmarked,
  onShare,
  onToggleBookmark,
  preferences,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'digital'>(
    paper.hasExtractedQuestions ? (preferences.preferViewMode || 'split') : 'original'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [practiceModeOpen, setPracticeModeOpen] = useState<boolean>(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handlePrint = (mode?: 'digital' | 'original') => {
    const targetMode = mode || (viewMode === 'original' ? 'original' : 'digital');
    printExamPaper(paper, targetMode);
  };

  // Font size mapping for digital view
  const fontSizeClass =
    preferences.fontSize === 'large'
      ? 'text-lg'
      : preferences.fontSize === 'medium'
      ? 'text-base'
      : 'text-sm';

  const containerWidthClass =
    preferences.readingWidth === 'full'
      ? 'max-w-[98vw]'
      : preferences.readingWidth === 'wide'
      ? 'max-w-7xl'
      : 'max-w-5xl';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`bg-stone-50 w-full ${containerWidthClass} h-[96vh] sm:h-[92vh] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-900/40 relative`}
      >
        {/* Top Header Bar */}
        <div className="bg-[#480D19] text-white px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#320811] flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 shrink-0">
          <div className="flex items-center justify-between gap-2 w-full md:w-auto min-w-0">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold bg-amber-400 text-stone-950">
                  {paper.batch}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium bg-white/10 text-amber-200 border border-white/15">
                  {paper.group}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium truncate">{paper.quizRound}</span>
                {paper.version === 'English Version' && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-200 text-sky-950">
                    EV
                  </span>
                )}
              </div>
              <h2 className="font-heading font-bold text-sm sm:text-lg md:text-xl truncate text-white" title={paper.title}>
                {paper.subject} <span className="bengali-text font-normal text-amber-200/90 text-xs sm:text-base">({paper.subjectBn})</span>
              </h2>
            </div>

            {/* Mobile close button right on top for immediate one-thumb access */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white border border-white/10 transition-colors shrink-0"
              title="Close Viewer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar (View switcher & tools) */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#320811] p-1 rounded-xl border border-white/10 shrink-0">
              {paper.hasExtractedQuestions && (
                <button
                  onClick={() => setViewMode('split')}
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'split' ? 'bg-[#6F1528] text-white font-semibold' : 'text-stone-300 hover:text-white'
                  }`}
                  title="Split Side-by-Side View"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split View</span>
                </button>
              )}
              <button
                onClick={() => setViewMode('original')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'original' ? 'bg-[#6F1528] text-white font-semibold' : 'text-stone-300 hover:text-white'
                }`}
                title="Original Document View"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Original</span>
              </button>
              {paper.hasExtractedQuestions && (
                <button
                  onClick={() => setViewMode('digital')}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'digital' ? 'bg-[#6F1528] text-white font-semibold' : 'text-stone-300 hover:text-white'
                  }`}
                  title="Organized Digital View"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Digital ({paper.questionsCount} Qs)</span>
                </button>
              )}
            </div>

            {/* Utility Tools */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Practice Mode Toggle */}
              <button
                onClick={() => setPracticeModeOpen(!practiceModeOpen)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border font-semibold text-xs transition-all shadow-sm ${
                  practiceModeOpen
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-300/50'
                    : 'bg-white/10 hover:bg-white/20 text-stone-200 border-white/10'
                }`}
                title="Practice Mode with Countdown Timer & Question Tracker"
                aria-label="Toggle Practice Mode"
              >
                <Timer className={`w-4 h-4 ${practiceModeOpen ? 'text-stone-950 animate-pulse' : 'text-amber-300'}`} />
                <span className="hidden sm:inline">Practice Mode</span>
              </button>

              {/* Prominent Print Paper Button */}
              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs transition-colors shadow-sm"
                title="Print Examination Paper or Save as PDF"
                aria-label="Print paper"
              >
                <Printer className="w-4 h-4 text-stone-950" />
                <span className="hidden sm:inline">Print (PDF)</span>
              </button>

              <button
                onClick={() => onToggleBookmark(paper.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : 'bg-white/10 hover:bg-white/15 text-stone-200 border-white/10'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
                aria-label="Bookmark paper"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onShare(paper)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-stone-200 border border-white/10 transition-colors"
                title="Share Direct Link"
                aria-label="Share paper"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Desktop close button */}
              <button
                onClick={onClose}
                className="hidden md:flex p-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white border border-white/10 transition-colors ml-1"
                title="Close Viewer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Provenance Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium truncate text-[11px] sm:text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Authentic NDC Exam Record</span>
            </span>
            <span className="hidden sm:inline text-stone-400">|</span>
            <span className="hidden sm:inline text-stone-500 font-mono text-[11px]">
              ID: {paper.fileId}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <button
              onClick={() => handlePrint()}
              className="inline-flex items-center gap-1 font-semibold text-[#540F1D] hover:underline"
              title="Print Examination Paper / Generate PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#540F1D]" />
              <span>Print</span>
            </button>
            <span className="text-stone-300">|</span>
            <a
              href={paper.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#540F1D] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ({paper.format.toUpperCase()})</span>
            </a>
            <span className="text-stone-300">|</span>
            <a
              href={paper.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-stone-600 hover:text-[#540F1D] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Drive</span>
            </a>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Split View Left / Original View: Document Display */}
          {(viewMode === 'original' || viewMode === 'split') && (
            <div
              className={`flex-1 flex flex-col bg-stone-900 border-r border-stone-800 overflow-hidden relative ${
                viewMode === 'split' ? 'md:w-1/2' : 'w-full'
              }`}
            >
              {/* Document Floating Control Bar */}
              <div className="bg-stone-950/80 backdrop-blur-md px-4 py-2 border-b border-stone-800 flex items-center justify-between text-stone-300 text-xs shrink-0 z-10">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-400">Original Document View</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 uppercase">
                    {paper.format}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleZoomOut}
                    className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    title="Zoom Out"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs text-stone-400 px-1">{zoomLevel}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    title="Zoom In"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] transition-colors"
                    title="Reset Zoom & Rotation"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => printOriginalDocument(paper)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 text-[11px] transition-colors"
                    title="Print Scanned Original Paper"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print Document</span>
                  </button>
                  {paper.format === 'image' && (
                    <button
                      onClick={handleRotate}
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                      title="Rotate 90°"
                      aria-label="Rotate image"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Document Canvas / Viewer Container */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-4 select-none relative bg-stone-950">
                {paper.format === 'image' ? (
                  <div
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.15s ease-out',
                    }}
                    className="max-w-full flex items-center justify-center shadow-2xl"
                  >
                    <img
                      src={paper.viewUrl}
                      alt={paper.title}
                      className="max-h-[75vh] w-auto object-contain rounded border border-stone-800 shadow-2xl bg-white"
                      loading="eager"
                      onError={(e) => {
                        // Fallback to drive preview iframe if direct image fails
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const iframe = document.createElement('iframe');
                          iframe.src = paper.previewUrl;
                          iframe.className = 'w-full h-[75vh] border-0 rounded bg-white';
                          iframe.title = paper.title;
                          parent.appendChild(iframe);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <iframe
                      src={paper.previewUrl}
                      title={paper.title}
                      className="w-full h-full border-0 rounded-lg shadow-xl bg-white"
                      allow="autoplay"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Split View Right / Digital View: Preserved Questions */}
          {(viewMode === 'digital' || viewMode === 'split') && (
            <div
              className={`flex-1 flex flex-col bg-stone-50 overflow-hidden ${
                viewMode === 'split' ? 'md:w-1/2' : 'w-full'
              }`}
            >
              {/* Digital View Header Bar */}
              <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 shrink-0">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[#540F1D]" />
                  <span className="font-semibold text-stone-900">
                    Organized Digital View ({paper.questionsCount} Questions Extracted)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPracticeModeOpen(!practiceModeOpen)}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] font-semibold transition-colors shadow-2xs ${
                      practiceModeOpen
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-white hover:bg-stone-200 border-stone-300 text-[#540F1D]'
                    }`}
                    title="Toggle Practice Mode with Countdown Timer"
                  >
                    <Timer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Practice Mode</span>
                  </button>
                  <button
                    onClick={() => printExamPaper(paper, 'digital')}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white hover:bg-stone-200 border border-stone-300 text-[#540F1D] text-[11px] font-semibold transition-colors shadow-2xs"
                    title="Print Formatted Question Sheet / PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#540F1D]" />
                    <span>Print Sheet</span>
                  </button>
                  <span className="text-stone-400 hidden sm:inline">|</span>
                  <span className="text-stone-500 font-sans text-[11px] hidden sm:inline">
                    Preserved verbatim
                  </span>
                </div>
              </div>

              {/* Digital Questions List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {paper.hasExtractedQuestions && paper.questions && paper.questions.length > 0 ? (
                  <>
                    {/* Exam Paper Header if available */}
                    {paper.examHeader && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-stone-800 text-center">
                        <h4 className="font-heading font-bold text-base text-[#540F1D]">
                          {paper.examHeader}
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {paper.subject} · {paper.quizRound} · {paper.batch}
                        </p>
                      </div>
                    )}

                    {/* Question Items */}
                    <div className="space-y-6">
                      {paper.questions.map((q, idx) => (
                        <div
                          key={q.id || idx}
                          id={q.id}
                          className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-3"
                        >
                          {/* Question Top Header */}
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#540F1D] text-amber-200 flex items-center justify-center text-xs font-bold">
                                {q.number}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                                {q.type === 'CQ' ? 'Creative Question (সৃজনশীল)' : q.type === 'MCQ' ? 'MCQ (বহুনির্বাচনী)' : 'Short Answer'}
                              </span>
                            </div>
                            {q.marks && (
                              <span className="text-xs font-semibold text-stone-600">
                                [পূর্ণমান: {q.marks}]
                              </span>
                            )}
                          </div>

                          {/* Stem if any */}
                          {q.stem && (
                            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-sm leading-relaxed bengali-text">
                              <span className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                                উদ্দীপক:
                              </span>
                              <div className="whitespace-pre-line font-medium text-stone-900">
                                {q.stem}
                              </div>
                            </div>
                          )}

                          {/* Question Text */}
                          <div
                            className={`text-stone-900 font-medium leading-relaxed bengali-text ${fontSizeClass}`}
                          >
                            {q.text}
                          </div>

                          {/* Sub-questions if any */}
                          {q.subQuestions && q.subQuestions.length > 0 && (
                            <div className="space-y-1.5 pt-2">
                              {q.subQuestions.map((sub, sIdx) => (
                                <div
                                  key={sIdx}
                                  className={`p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/60 text-stone-900 bengali-text ${fontSizeClass}`}
                                >
                                  {sub}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Options if MCQ */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 bengali-text ${fontSizeClass}`}
                                >
                                  <span className="font-semibold text-stone-900">{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* State when paper has original document preserved but waiting digital extraction */
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#540F1D]">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="max-w-md space-y-2">
                      <h4 className="font-heading font-bold text-lg text-stone-900">
                        Original Document Preserved
                      </h4>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        This examination paper is cataloged directly from Notre Dame College&apos;s Google Drive archive.
                        The original scanned document / PDF is accessible in full resolution on the left.
                      </p>
                    </div>
                    <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-600 max-w-sm border border-stone-200">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-800 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Preservation Rule:</span>
                      </div>
                      We only publish authentic questions directly verified from the original source without alteration.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Practice Mode Countdown Timer & Lap Tracker Overlay */}
        {practiceModeOpen && (
          <PracticeTimerOverlay
            questions={paper.questions || []}
            onClose={() => setPracticeModeOpen(false)}
            onJumpToQuestion={(qId) => {
              const el = document.getElementById(qId);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-2', 'ring-amber-400', 'transition-all');
                setTimeout(() => {
                  el.classList.remove('ring-2', 'ring-amber-400');
                }, 1500);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
