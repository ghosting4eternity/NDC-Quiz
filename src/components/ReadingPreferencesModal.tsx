import React from 'react';
import { X, Settings, Type, Layout, Eye, Check } from 'lucide-react';
import { ReadingPreferences } from '../types/archive';

interface ReadingPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ReadingPreferences;
  onUpdatePreferences: (newPrefs: Partial<ReadingPreferences>) => void;
}

export const ReadingPreferencesModal: React.FC<ReadingPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-[#480D19] text-white px-5 py-4 flex items-center justify-between border-b border-[#300710]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-300" />
            <h3 className="font-heading font-bold text-base text-white">Reading Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close preferences modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-5 space-y-6 text-sm">
          {/* Font Size */}
          <div className="space-y-2.5">
            <label className="font-semibold text-stone-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#540F1D]" />
              Question Text Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'standard', label: 'Standard', sub: '14px' },
                  { id: 'medium', label: 'Medium', sub: '16px' },
                  { id: 'large', label: 'Large', sub: '18px' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdatePreferences({ fontSize: opt.id })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    preferences.fontSize === opt.id
                      ? 'border-[#540F1D] bg-[#540F1D]/5 text-[#540F1D] font-bold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reading Width */}
          <div className="space-y-2.5">
            <label className="font-semibold text-stone-900 flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#540F1D]" />
              Reader Width
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'standard', label: 'Standard', desc: 'Centered' },
                  { id: 'wide', label: 'Wide', desc: 'Balanced' },
                  { id: 'full', label: 'Full', desc: 'Maximum' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdatePreferences({ readingWidth: opt.id })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    preferences.readingWidth === opt.id
                      ? 'border-[#540F1D] bg-[#540F1D]/5 text-[#540F1D] font-bold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Document View Mode */}
          <div className="space-y-2.5">
            <label className="font-semibold text-stone-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#540F1D]" />
              Default Examination Viewer Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'split', label: 'Split View', desc: 'Original + Digital' },
                  { id: 'original', label: 'Original', desc: 'Scanned Paper' },
                  { id: 'digital', label: 'Digital', desc: 'Extracted Text' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdatePreferences({ preferViewMode: opt.id })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    preferences.preferViewMode === opt.id
                      ? 'border-[#540F1D] bg-[#540F1D]/5 text-[#540F1D] font-bold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500 leading-relaxed">
            Preferences are saved automatically in your browser session for your convenience.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#540F1D] hover:bg-[#6F1528] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
