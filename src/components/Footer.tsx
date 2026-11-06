import React from 'react';
import { ExternalLink, ShieldCheck, BookOpen, Library, Landmark } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#2D060E] text-stone-300 border-t border-[#4A0E1A] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#4B0C1A] border border-amber-400/40 flex items-center justify-center text-amber-300 font-heading font-bold text-sm shadow-inner">
                NDC
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg tracking-tight">
                  NDC Quiz Archive
                </h3>
                <p className="text-xs text-amber-200/80 font-sans">
                  নটর ডেম কলেজ সাপ্তাহিক পরীক্ষা ডিজিটাল সংগ্রহশালা
                </p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed max-w-lg">
              A comprehensive digital academic repository dedicated to preserving, organizing, and making
              searchable the historical weekly Quiz examination papers of Notre Dame College, Dhaka.
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#3D0A14] text-amber-300 border border-amber-500/20 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Absolute Question Integrity
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#3D0A14] text-stone-300 border border-white/10 font-medium">
                <Library className="w-3.5 h-3.5 text-stone-400" />
                960 Historical Records
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#3D0A14] text-stone-300 border border-white/10 font-medium">
                <Landmark className="w-3.5 h-3.5 text-stone-400" />
                Batches 17 to 28
              </span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-3">
              Archive Directory
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onSelectTab('archive')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Complete Archive (All Papers)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('questions')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Question Explorer (Item Bank)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('subjects')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Browse by Subject (18 Subjects)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('batches')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Browse by Academic Batch
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  About the Archive & NDC Quizzes
                </button>
              </li>
            </ul>
          </div>

          {/* Primary Source & Archival Policy */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-3">
              Source & Provenance
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="text-xs leading-relaxed">
                All records originate from the primary historical repository hosted on Google Drive.
              </p>
              <a
                href="https://drive.google.com/drive/folders/1BW0InS-rnlLd3VienUaQLoKm14dj_ZEA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#420B16] hover:bg-[#57101E] border border-amber-500/30 text-amber-200 rounded text-xs font-medium transition-colors"
              >
                <span>Open Google Drive Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-stone-400 leading-normal pt-1">
                Zero altered questions · Zero AI generated answers · Original documents preserved.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>
            An independent student-oriented archival repository. Not officially affiliated with or operated
            by Notre Dame College, Dhaka.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-serif italic text-amber-300/80">Preserve · Organize · Discover</span>
            <span>© {new Date().getFullYear()} NDC Quiz Archive</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
