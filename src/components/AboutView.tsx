import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  Library,
  ExternalLink,
  Ban,
  CheckCircle2,
  HelpCircle,
  FileText,
  Heart,
  Landmark,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#540F1D] text-xs font-semibold">
          <Landmark className="w-4 h-4 text-amber-600" />
          <span>Independent Student Archival Initiative</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight">
          About NDC Quiz Archive
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-[#540F1D] max-w-2xl mx-auto">
          &ldquo;Preserve. Organize. Discover.&rdquo;
        </p>
      </div>

      {/* Core Mission Block */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6 text-stone-700 leading-relaxed">
        <div className="space-y-4 text-base sm:text-lg text-stone-800">
          <p>
            <strong>NDC Quiz Archive</strong> is an organized digital repository of Notre Dame
            College&apos;s historical weekly Quiz examination questions.
          </p>
          <p className="text-sm sm:text-base text-stone-600">
            At Notre Dame College, Dhaka, the term &ldquo;Quiz&rdquo; refers to the regular weekly academic
            examinations conducted by the college throughout each student&apos;s two-year Higher Secondary
            education. It does not mean recreational quizzes, trivia games, or online competitions.
          </p>
          <p className="text-sm sm:text-base text-stone-600">
            Over the years, students have accumulated hundreds of question papers across folders and files,
            making it difficult to locate particular questions or examination papers when preparing for tests.
            The purpose of this project is to bring these materials together into one centralized, searchable,
            and easily accessible digital academic library.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 font-serif italic text-center text-sm sm:text-base">
          &ldquo;No alterations. No unnecessary complications. Just an organized archive.&rdquo;
        </div>
      </div>

      {/* Absolute Question Integrity */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-stone-900">
              Absolute Question Integrity
            </h2>
            <p className="text-xs text-stone-500">Our non-negotiable archival standard</p>
          </div>
        </div>

        <p className="text-sm text-stone-700 leading-relaxed">
          The archive is an authentic historical record, not an answer bank or educational content
          generator. We strictly adhere to these principles:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          {[
            'Never rewrite or rephrase questions',
            'Never alter mathematical equations or symbols',
            'Preserve original Bengali and English text verbatim',
            'Preserve original question numbering and sequence',
            'Retain all diagrams, tables, and stems (উদ্দীপক)',
            'Original documents always accessible as primary authority',
          ].map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-stone-800 font-medium">{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What This Website Must Never Become */}
      <div className="bg-[#2D060E] text-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-red-950 text-red-400 border border-red-800 flex items-center justify-center">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-white">
              What This Website Must Never Become
            </h2>
            <p className="text-xs text-amber-200/80">Archival boundaries & student focus</p>
          </div>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed">
          This project is exclusively an archival repository. To maintain focus and academic authenticity,
          the platform deliberately excludes:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            'No online examination timers or countdowns',
            'No automatic grading or marks calculations',
            'No AI-generated question solvers or explanations',
            'No MCQ practice games or competitive leaderboards',
            'No mandatory student registrations or paywalls',
            'No commercial advertisements or coaching promotions',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-stone-300 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Data Source & Provenance */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-lg text-stone-900 flex items-center gap-2">
          <Library className="w-5 h-5 text-[#540F1D]" />
          <span>Primary Historical Dataset Citation</span>
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          All 960 examination records in this archive are cataloged from the primary collection repository:
        </p>
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-stone-900 text-sm">
              Google Drive — NDC Quiz Archive
            </div>
            <div className="text-xs text-stone-500 font-mono mt-0.5 truncate max-w-sm sm:max-w-md">
              Folder ID: 1BW0InS-rnlLd3VienUaQLoKm14dj_ZEA
            </div>
          </div>
          <a
            href="https://drive.google.com/drive/folders/1BW0InS-rnlLd3VienUaQLoKm14dj_ZEA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#540F1D] hover:bg-[#6F1528] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
          >
            <span>Open Primary Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Disclaimer of Non-Affiliation */}
      <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-2">
        <h4 className="font-bold text-stone-800 uppercase tracking-wide">
          Disclaimer of Non-Affiliation:
        </h4>
        <p className="leading-relaxed">
          NDC Quiz Archive is an independent, non-commercial student-led educational archival initiative.
          It is not officially operated, maintained, endorsed, or affiliated with the Notre Dame College
          administration, Dhaka. All examination materials remain the intellectual legacy of their respective
          academic faculties.
        </p>
      </div>
    </div>
  );
};
