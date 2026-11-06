import rawPapers from './papersData.json';
import { ExamPaper, ExamQuestion } from '../types/archive';

export const allPapers: ExamPaper[] = rawPapers as ExamPaper[];

export const allExtractedQuestions: ExamQuestion[] = allPapers.flatMap((p) => p.questions || []);

// Distinct subjects catalog
export interface SubjectSummary {
  name: string;
  nameBn: string;
  group: 'Science' | 'Business Studies' | 'Humanities' | 'General';
  groupBn: string;
  paperCount: number;
  questionCount: number;
  batches: string[];
}

const subjectGroupMap: Record<string, { bn: string; grp: 'Science' | 'Business Studies' | 'Humanities' | 'General'; grpBn: string }> = {
  Physics: { bn: 'পদার্থবিজ্ঞান', grp: 'Science', grpBn: 'বিজ্ঞান' },
  Chemistry: { bn: 'রসায়ন', grp: 'Science', grpBn: 'বিজ্ঞান' },
  'Higher Mathematics': { bn: 'উচ্চতর গণিত', grp: 'Science', grpBn: 'বিজ্ঞান' },
  Biology: { bn: 'জীববিজ্ঞান', grp: 'Science', grpBn: 'বিজ্ঞান' },
  Bangla: { bn: 'বাংলা', grp: 'General', grpBn: 'সাধারণ' },
  English: { bn: 'ইংরেজি', grp: 'General', grpBn: 'সাধারণ' },
  ICT: { bn: 'তথ্য ও যোগাযোগ প্রযুক্তি', grp: 'General', grpBn: 'সাধারণ' },
  Accounting: { bn: 'হিসাববিজ্ঞান', grp: 'Business Studies', grpBn: 'ব্যবসায় শিক্ষা' },
  'Finance, Banking & Insurance': { bn: 'ফিন্যান্স, ব্যাংকিং ও বীমা', grp: 'Business Studies', grpBn: 'ব্যবসায় শিক্ষা' },
  'Business Organization': { bn: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা', grp: 'Business Studies', grpBn: 'ব্যবসায় শিক্ষা' },
  Economics: { bn: 'অর্থনীতি', grp: 'Humanities', grpBn: 'মানবিক' },
  Statistics: { bn: 'পরিসংখ্যান', grp: 'Science', grpBn: 'বিজ্ঞান' },
  'Civics & Good Governance': { bn: 'পৌরনীতি ও সুশাসন', grp: 'Humanities', grpBn: 'মানবিক' },
  Geography: { bn: 'ভূগোল', grp: 'Humanities', grpBn: 'মানবিক' },
  Logic: { bn: 'যুক্তিবিদ্যা', grp: 'Humanities', grpBn: 'মানবিক' },
  Sociology: { bn: 'সমাজবিজ্ঞান', grp: 'Humanities', grpBn: 'মানবিক' },
  'Islamic History & Culture': { bn: 'ইসলামের ইতিহাস ও সংস্কৃতি', grp: 'Humanities', grpBn: 'মানবিক' },
  'Social Work': { bn: 'সমাজকর্ম', grp: 'Humanities', grpBn: 'মানবিক' },
  'Comprehensive Exam Compilation': { bn: 'যৌথ পরীক্ষা সংকলন (মাল্টি-সাবজেক্ট)', grp: 'General', grpBn: 'সাধারণ' },
};

const subjMap = new Map<string, SubjectSummary>();

for (const p of allPapers) {
  const sName = p.subject;
  const meta = subjectGroupMap[sName] || {
    bn: p.subjectBn || sName,
    grp: p.group || 'General',
    grpBn: p.groupBn || 'সাধারণ',
  };

  if (!subjMap.has(sName)) {
    subjMap.set(sName, {
      name: sName,
      nameBn: meta.bn,
      group: meta.grp,
      groupBn: meta.grpBn,
      paperCount: 0,
      questionCount: 0,
      batches: [],
    });
  }

  const s = subjMap.get(sName)!;
  s.paperCount += 1;
  s.questionCount += p.questionsCount || 0;
  if (!s.batches.includes(p.batch)) {
    s.batches.push(p.batch);
  }
}

export const subjectSummaries: SubjectSummary[] = Array.from(subjMap.values()).sort(
  (a, b) => b.paperCount - a.paperCount
);

export interface BatchSummary {
  name: string;
  batchNumber: number;
  session: string;
  paperCount: number;
  questionCount: number;
  description: string;
}

const batchInfoList: Record<string, { session: string; desc: string }> = {
  'Batch 28': { session: 'HSC 2028 (2026–2028)', desc: 'Current 1st Year cohort at Notre Dame College.' },
  'Batch 27': { session: 'HSC 2027 (2025–2027)', desc: 'Current 2nd Year cohort at Notre Dame College.' },
  'Batch 26': { session: 'HSC 2026 (2024–2026)', desc: 'Includes full rounds of Year 1 & Year 2 weekly quizzes across BV & EV.' },
  'Batch 25': { session: 'HSC 2025 (2023–2025)', desc: 'Extensive coverage of Science, Business Studies, and Humanities rounds and promotion exams.' },
  'Batch 24': { session: 'HSC 2024 (2022–2024)', desc: 'Largest single batch collection with over 350+ examination papers across all groups.' },
  'Batch 23': { session: 'HSC 2023 (2021–2023)', desc: 'Historical round quiz compilations and term examination records.' },
  'Batch 22': { session: 'HSC 2022 (2020–2022)', desc: 'Historical round quiz and sent-up examination records.' },
  'Batch 19': { session: 'HSC 2019 (2017–2019)', desc: 'Term 1, Sent Up 1 & Sent Up 2 historical PDF archives.' },
  'Batch 17': { session: 'HSC 2017 (2015–2017)', desc: 'Historical foundation archive of NDC quizzes, terms, and sent-up tests.' },
};

const bMap = new Map<string, BatchSummary>();

for (const p of allPapers) {
  const bName = p.batch;
  if (!bMap.has(bName)) {
    const meta = batchInfoList[bName] || {
      session: p.session,
      desc: 'Historical NDC academic records.',
    };
    bMap.set(bName, {
      name: bName,
      batchNumber: p.batchNumber,
      session: meta.session,
      paperCount: 0,
      questionCount: 0,
      description: meta.desc,
    });
  }
  const b = bMap.get(bName)!;
  b.paperCount += 1;
  b.questionCount += p.questionsCount || 0;
}

export const batchSummaries: BatchSummary[] = Array.from(bMap.values()).sort(
  (a, b) => b.batchNumber - a.batchNumber
);
