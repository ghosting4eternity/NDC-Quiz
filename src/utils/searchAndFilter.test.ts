import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  matchesPaper,
  filterPapers,
  sortPapers,
  filterQuestions,
  calculateArchiveStats,
} from './searchAndFilter';
import { ExamPaper, ExamQuestion, FilterState } from '../types/archive';

const samplePaper1: ExamPaper = {
  id: 'paper-1',
  fileId: 'file-1',
  batch: 'Batch 26',
  batchNumber: 26,
  session: '2024-2026',
  group: 'Science',
  groupBn: 'বিজ্ঞান',
  subject: 'Physics',
  subjectBn: 'পদার্থবিজ্ঞান',
  version: 'Bangla Version',
  quizRound: 'Year 1 Round 1 Quiz',
  yearLevel: 'Year 1',
  format: 'image',
  title: 'Batch 26 · Year 1 Round 1 Quiz · Physics [BV]',
  originalFileName: 'Physics [BV].jpg',
  originalPath: 'Batch 26 /1. Year 1 Round 1 Quiz/Physics [BV].jpg',
  driveUrl: 'https://drive.google.com/file/d/file-1/view',
  previewUrl: 'https://drive.google.com/file/d/file-1/preview',
  downloadUrl: 'https://drive.google.com/uc?export=download&id=file-1',
  viewUrl: 'https://lh3.googleusercontent.com/d/file-1',
  verified: true,
  hasExtractedQuestions: true,
  questionsCount: 2,
  questions: [
    {
      id: 'q-1-1',
      paperId: 'paper-1',
      number: '1',
      type: 'MCQ',
      stem: null,
      text: '(2i + 2j - 2k) এবং (2i - j + 2k) ভেক্টরের যোগফল',
      subQuestions: [],
      options: ['(ক) -4i - j', '(খ) 4i + j + k'],
      marks: '1',
      subject: 'Physics',
      subjectBn: 'পদার্থবিজ্ঞান',
      batch: 'Batch 26',
      quizRound: 'Year 1 Round 1 Quiz',
      yearLevel: 'Year 1',
      group: 'Science',
    },
    {
      id: 'q-1-2',
      paperId: 'paper-1',
      number: '2',
      type: 'CQ',
      stem: 'মেসি ও নেইমার একবিন্দুতে দাঁড়িয়ে',
      text: 'সৃজনশীল প্রশ্ন',
      subQuestions: ['(ক) লব্ধি ভেক্টর কি?'],
      options: [],
      marks: '10',
      subject: 'Physics',
      subjectBn: 'পদার্থবিজ্ঞান',
      batch: 'Batch 26',
      quizRound: 'Year 1 Round 1 Quiz',
      yearLevel: 'Year 1',
      group: 'Science',
    },
  ],
};

const samplePaper2: ExamPaper = {
  id: 'paper-2',
  fileId: 'file-2',
  batch: 'Batch 24',
  batchNumber: 24,
  session: '2022-2024',
  group: 'Business Studies',
  groupBn: 'ব্যবসায় শিক্ষা',
  subject: 'Accounting',
  subjectBn: 'হিসাববিজ্ঞান',
  version: 'Bangla Version',
  quizRound: 'Year 1 Term 1',
  yearLevel: 'Year 1',
  format: 'pdf',
  title: 'Batch 24 · Year 1 Term 1 · Accounting',
  originalFileName: 'Accounting.pdf',
  originalPath: 'Batch 24 /Business Studies/Accounting.pdf',
  driveUrl: 'https://drive.google.com/file/d/file-2/view',
  previewUrl: 'https://drive.google.com/file/d/file-2/preview',
  downloadUrl: 'https://drive.google.com/uc?export=download&id=file-2',
  viewUrl: 'https://lh3.googleusercontent.com/d/file-2',
  verified: true,
  hasExtractedQuestions: false,
  questionsCount: 0,
  questions: [],
};

test('normalizeText handles punctuation and whitespace', () => {
  assert.equal(normalizeText('  পদার্থবিজ্ঞান, ১ম পত্র! '), 'পদার্থবিজ্ঞান ১ম পত্র!');
});

test('matchesPaper finds text in title or metadata', () => {
  assert.equal(matchesPaper(samplePaper1, 'Physics'), true);
  assert.equal(matchesPaper(samplePaper1, 'পদার্থবিজ্ঞান'), true);
  assert.equal(matchesPaper(samplePaper1, 'Batch 26'), true);
  assert.equal(matchesPaper(samplePaper1, 'Accounting'), false);
});

test('matchesPaper performs deep search inside questions and stems', () => {
  // Should match "মেসি" which is inside stem of question 2
  assert.equal(matchesPaper(samplePaper1, 'মেসি'), true);
  // Should match "লব্ধি" which is in sub-questions
  assert.equal(matchesPaper(samplePaper1, 'লব্ধি'), true);
  assert.equal(matchesPaper(samplePaper2, 'মেসি'), false);
});

test('filterPapers filters by batch, group, and subject', () => {
  const papers = [samplePaper1, samplePaper2];
  const filterScience: FilterState = {
    searchQuery: '',
    batch: 'all',
    group: 'Science',
    subject: 'all',
    version: 'all',
    yearLevel: 'all',
    format: 'all',
    hasExtractedQuestionsOnly: false,
    sortBy: 'newest',
  };

  const resScience = filterPapers(papers, filterScience);
  assert.equal(resScience.length, 1);
  assert.equal(resScience[0].id, 'paper-1');

  const filterExtracted: FilterState = {
    ...filterScience,
    group: 'all',
    hasExtractedQuestionsOnly: true,
  };
  const resExtracted = filterPapers(papers, filterExtracted);
  assert.equal(resExtracted.length, 1);
  assert.equal(resExtracted[0].id, 'paper-1');
});

test('sortPapers sorts correctly by batch number', () => {
  const papers = [samplePaper2, samplePaper1];
  const sortedNewest = sortPapers(papers, 'newest');
  assert.equal(sortedNewest[0].batchNumber, 26);
  assert.equal(sortedNewest[1].batchNumber, 24);

  const sortedOldest = sortPapers(papers, 'oldest');
  assert.equal(sortedOldest[0].batchNumber, 24);
  assert.equal(sortedOldest[1].batchNumber, 26);
});

test('filterQuestions searches across questions correctly', () => {
  const allQuestions: ExamQuestion[] = samplePaper1.questions;
  const res = filterQuestions(allQuestions, 'মেসি', 'all', 'all', 'all', 'all');
  assert.equal(res.length, 1);
  assert.equal(res[0].number, '2');

  const emptyRes = filterQuestions(allQuestions, 'অজানা', 'all', 'all', 'all', 'all');
  assert.equal(emptyRes.length, 0);
});

test('calculateArchiveStats calculates valid statistics', () => {
  const stats = calculateArchiveStats([samplePaper1, samplePaper2]);
  assert.equal(stats.totalPapers, 2);
  assert.equal(stats.batches, 2);
  assert.equal(stats.subjects, 2);
  assert.equal(stats.withExtractedQuestions, 1);
  assert.equal(stats.totalExtractedQuestions, 2);
  assert.equal(stats.pdfCount, 1);
  assert.equal(stats.imageCount, 1);
});
