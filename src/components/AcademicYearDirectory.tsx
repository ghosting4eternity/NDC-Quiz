import React from 'react';
import { Calendar, ArrowRight, Award, History, Layers, CheckCircle2, BookOpen } from 'lucide-react';
import { batchSummaries, BatchSummary } from '../data/papers';

interface AcademicYearDirectoryProps {
  onSelectBatch: (batchName: string) => void;
}

export const AcademicYearDirectory: React.FC<AcademicYearDirectoryProps> = ({ onSelectBatch }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Directory Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#540F1D] text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Notre Dame College Academic History</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-900 tracking-tight">
          Academic Batches & Examination Rounds
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          At Notre Dame College, Dhaka, the academic journey is structured around regular weekly Quiz
          examinations, organized into sequential rounds across Year 1 and Year 2.
        </p>
      </div>

      {/* Explanatory Guide to the NDC Quiz System */}
      <div className="bg-gradient-to-br from-[#450A15] to-[#2B050E] text-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40 space-y-6">
        <div className="flex items-center gap-2.5">
          <History className="w-6 h-6 text-amber-300" />
          <h3 className="font-heading font-bold text-xl text-white">
            Understanding the NDC Weekly Quiz Examination Structure
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-heading font-semibold text-amber-300 text-base">
              1. 1st Year (Class 11)
            </h4>
            <p className="text-stone-300 leading-relaxed text-xs">
              Students undergo 4 continuous Quiz Rounds (Round 1 to 4) covering syllabus units, followed by
              the comprehensive 1st Year Term Examination and Promotion Quizzes.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-heading font-semibold text-amber-300 text-base">
              2. 2nd Year (Class 12)
            </h4>
            <p className="text-stone-300 leading-relaxed text-xs">
              Advanced curriculum assessed through Year 2 Quiz Rounds, leading to Sent Up 1 and Sent Up 2
              (Pre-Test and Test examinations) in preparation for Board exams.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-heading font-semibold text-amber-300 text-base">
              3. BV & EV Dual Streams
            </h4>
            <p className="text-stone-300 leading-relaxed text-xs">
              Questions exist in both Bangla Version (BV) and English Version (EV), reflecting Notre Dame
              College&apos;s dual-medium classroom instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batchSummaries.map((batch) => (
          <div
            key={batch.name}
            className="bg-white rounded-2xl border border-stone-200 hover:border-amber-500/60 hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#540F1D] text-amber-200 border border-[#3D0A14]">
                  {batch.name}
                </span>
                <span className="text-xs text-stone-500 font-mono font-medium">
                  {batch.paperCount} Papers
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-stone-900 mt-2">
                {batch.session}
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {batch.description}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Cataloged Questions:</span>
                <span className="font-bold text-[#540F1D] text-sm">
                  {batch.questionCount} Questions
                </span>
              </div>

              <button
                onClick={() => onSelectBatch(batch.name)}
                className="px-4 py-2 rounded-xl bg-stone-50 hover:bg-[#540F1D] text-stone-800 hover:text-white border border-stone-200 hover:border-transparent font-medium text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Browse Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
