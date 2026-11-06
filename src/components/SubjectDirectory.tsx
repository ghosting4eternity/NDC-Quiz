import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  ArrowRight,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  BookA,
  Languages,
  Cpu,
  BarChart3,
  TrendingUp,
  Coins,
  Scale,
  Compass,
  Lightbulb,
  Users,
  Search,
} from 'lucide-react';
import { subjectSummaries, SubjectSummary } from '../data/papers';

interface SubjectDirectoryProps {
  onSelectSubject: (subjectName: string) => void;
}

export const SubjectDirectory: React.FC<SubjectDirectoryProps> = ({ onSelectSubject }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const groupOptions = [
    { id: 'all', label: 'All Subjects (18)', count: subjectSummaries.length },
    { id: 'Science', label: 'Science (বিজ্ঞান)', count: subjectSummaries.filter((s) => s.group === 'Science').length },
    { id: 'Business Studies', label: 'Business Studies (ব্যবসায় শিক্ষা)', count: subjectSummaries.filter((s) => s.group === 'Business Studies').length },
    { id: 'Humanities', label: 'Humanities (মানবিক)', count: subjectSummaries.filter((s) => s.group === 'Humanities').length },
    { id: 'General', label: 'General / Language (সাধারণ)', count: subjectSummaries.filter((s) => s.group === 'General').length },
  ];

  const filteredSubjects = subjectSummaries.filter((s) => {
    if (selectedGroup !== 'all' && s.group !== selectedGroup) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.nameBn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSubjectIcon = (name: string) => {
    switch (name) {
      case 'Physics':
        return <Atom className="w-6 h-6 text-indigo-600" />;
      case 'Chemistry':
        return <FlaskConical className="w-6 h-6 text-emerald-600" />;
      case 'Higher Mathematics':
        return <Calculator className="w-6 h-6 text-blue-600" />;
      case 'Biology':
        return <Dna className="w-6 h-6 text-teal-600" />;
      case 'Bangla':
        return <BookA className="w-6 h-6 text-rose-600" />;
      case 'English':
        return <Languages className="w-6 h-6 text-sky-600" />;
      case 'ICT':
        return <Cpu className="w-6 h-6 text-cyan-600" />;
      case 'Accounting':
        return <BarChart3 className="w-6 h-6 text-violet-600" />;
      case 'Finance, Banking & Insurance':
        return <Coins className="w-6 h-6 text-amber-600" />;
      case 'Economics':
        return <TrendingUp className="w-6 h-6 text-orange-600" />;
      case 'Civics & Good Governance':
        return <Scale className="w-6 h-6 text-stone-600" />;
      case 'Geography':
        return <Compass className="w-6 h-6 text-emerald-700" />;
      case 'Logic':
        return <Lightbulb className="w-6 h-6 text-yellow-600" />;
      case 'Sociology':
        return <Users className="w-6 h-6 text-pink-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-[#540F1D]" />;
    }
  };

  const groupBadges: Record<string, string> = {
    Science: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Business Studies': 'bg-blue-50 text-blue-800 border-blue-200',
    Humanities: 'bg-amber-50 text-amber-800 border-amber-200',
    General: 'bg-stone-100 text-stone-800 border-stone-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Directory Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#540F1D] text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Notre Dame College Academic Disciplines</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-900 tracking-tight">
          Subject Directory
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Explore past examination papers organized by academic subject. All subjects are dynamically
          indexed from original Notre Dame College examination papers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {groupOptions.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedGroup === g.id
                  ? 'bg-[#540F1D] text-white shadow-xs font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {g.label} ({g.count})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search subjects..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#540F1D] text-stone-800"
          />
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.name}
            className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-500/60 hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 group-hover:scale-105 transition-transform">
                  {getSubjectIcon(subject.name)}
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${
                    groupBadges[subject.group] || groupBadges.General
                  }`}
                >
                  {subject.groupBn}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-stone-900 group-hover:text-[#540F1D] transition-colors">
                {subject.name}
              </h3>
              <p className="bengali-text text-stone-600 text-sm font-medium mt-0.5">
                {subject.nameBn}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Total Examination Papers:</span>
                <span className="font-bold text-stone-900">{subject.paperCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Cataloged Questions:</span>
                <span className="font-bold text-[#540F1D]">{subject.questionCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Batches Available:</span>
                <span className="text-stone-700 text-right truncate max-w-[160px]" title={subject.batches.join(', ')}>
                  {subject.batches.slice(0, 3).join(', ')}
                  {subject.batches.length > 3 ? ` +${subject.batches.length - 3}` : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectSubject(subject.name)}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-[#540F1D] text-stone-800 hover:text-white border border-stone-200 hover:border-transparent font-medium text-xs transition-all flex items-center justify-center gap-2 group-hover:shadow-sm"
            >
              <span>Explore All {subject.paperCount} Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
