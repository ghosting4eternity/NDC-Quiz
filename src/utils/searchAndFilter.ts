import { ExamPaper, ExamQuestion, FilterState } from '../types/archive';

export function normalizeText(text?: string | null): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars
    .replace(/[,\-_।]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesPaper(paper: ExamPaper, query: string): boolean {
  if (!query) return true;
  const q = normalizeText(query);
  const qTokens = q.split(' ').filter(Boolean);

  const searchableString = normalizeText(
    `${paper.title} ${paper.subject} ${paper.subjectBn} ${paper.batch} ${paper.quizRound} ${paper.group} ${paper.groupBn} ${paper.version} ${paper.originalFileName} ${paper.session}`
  );

  // If simple match in metadata
  const metadataMatch = qTokens.every((token) => searchableString.includes(token));
  if (metadataMatch) return true;

  // Search inside questions
  if (paper.questions && paper.questions.length > 0) {
    for (const qItem of paper.questions) {
      const qText = normalizeText(
        `${qItem.number} ${qItem.text} ${qItem.stem || ''} ${qItem.subQuestions?.join(' ') || ''} ${qItem.options?.join(' ') || ''}`
      );
      if (qTokens.every((token) => qText.includes(token))) {
        return true;
      }
    }
  }

  return false;
}

export function filterPapers(papers: ExamPaper[], filters: FilterState): ExamPaper[] {
  return papers.filter((paper) => {
    // Search query
    if (filters.searchQuery && !matchesPaper(paper, filters.searchQuery)) {
      return false;
    }

    // Batch
    if (filters.batch && filters.batch !== 'all' && paper.batch !== filters.batch) {
      return false;
    }

    // Group
    if (filters.group && filters.group !== 'all' && paper.group !== filters.group) {
      return false;
    }

    // Subject
    if (filters.subject && filters.subject !== 'all' && paper.subject !== filters.subject) {
      return false;
    }

    // Version
    if (filters.version && filters.version !== 'all') {
      if (filters.version === 'Bangla Version' && paper.version !== 'Bangla Version') {
        return false;
      }
      if (filters.version === 'English Version' && paper.version !== 'English Version') {
        return false;
      }
    }

    // Year level
    if (filters.yearLevel && filters.yearLevel !== 'all' && paper.yearLevel !== filters.yearLevel) {
      return false;
    }

    // Format
    if (filters.format && filters.format !== 'all' && paper.format !== filters.format) {
      return false;
    }

    // Extracted questions only
    if (filters.hasExtractedQuestionsOnly && !paper.hasExtractedQuestions) {
      return false;
    }

    return true;
  });
}

export function sortPapers(papers: ExamPaper[], sortBy: FilterState['sortBy']): ExamPaper[] {
  const sorted = [...papers];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.batchNumber - a.batchNumber || a.title.localeCompare(b.title));
    case 'oldest':
      return sorted.sort((a, b) => a.batchNumber - b.batchNumber || a.title.localeCompare(b.title));
    case 'subject_asc':
      return sorted.sort((a, b) => a.subject.localeCompare(b.subject) || b.batchNumber - a.batchNumber);
    case 'subject_desc':
      return sorted.sort((a, b) => b.subject.localeCompare(a.subject) || b.batchNumber - a.batchNumber);
    case 'questions_count':
      return sorted.sort((a, b) => b.questionsCount - a.questionsCount || b.batchNumber - a.batchNumber);
    default:
      return sorted;
  }
}

export function filterQuestions(
  allQuestions: ExamQuestion[],
  query: string,
  subject: string,
  batch: string,
  group: string,
  type: string
): ExamQuestion[] {
  const qNorm = normalizeText(query);
  const qTokens = qNorm ? qNorm.split(' ').filter(Boolean) : [];

  return allQuestions.filter((q) => {
    if (subject && subject !== 'all' && q.subject !== subject) return false;
    if (batch && batch !== 'all' && q.batch !== batch) return false;
    if (group && group !== 'all' && q.group !== group) return false;
    if (type && type !== 'all' && q.type !== type) return false;

    if (qTokens.length > 0) {
      const searchBlob = normalizeText(
        `${q.number} ${q.text} ${q.stem || ''} ${q.subQuestions?.join(' ') || ''} ${q.options?.join(' ') || ''} ${q.subject} ${q.subjectBn} ${q.batch} ${q.quizRound}`
      );
      if (!qTokens.every((token) => searchBlob.includes(token))) {
        return false;
      }
    }

    return true;
  });
}

export function calculateArchiveStats(papers: ExamPaper[]) {
  const totalPapers = papers.length;
  const batches = new Set(papers.map((p) => p.batch)).size;
  const subjects = new Set(papers.map((p) => p.subject)).size;
  const withExtractedQuestions = papers.filter((p) => p.hasExtractedQuestions).length;
  const totalExtractedQuestions = papers.reduce((acc, p) => acc + (p.questionsCount || 0), 0);
  const pdfCount = papers.filter((p) => p.format === 'pdf').length;
  const imageCount = papers.filter((p) => p.format === 'image').length;

  return {
    totalPapers,
    batches,
    subjects,
    withExtractedQuestions,
    totalExtractedQuestions,
    pdfCount,
    imageCount,
  };
}
