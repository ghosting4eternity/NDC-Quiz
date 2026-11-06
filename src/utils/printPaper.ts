import { ExamPaper } from '../types/archive';

export function printExamPaper(paper: ExamPaper, mode: 'digital' | 'original' = 'digital') {
  // If original mode or paper has no extracted questions, print original scanned document
  if (mode === 'original' || !paper.hasExtractedQuestions || !paper.questions || paper.questions.length === 0) {
    printOriginalDocument(paper);
    return;
  }

  // Digital Question Sheet
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    // If popup blocked, fall back to window.print()
    window.print();
    return;
  }

  const questionsHtml = paper.questions
    .map(
      (q) => `
    <div class="question-block">
      <div class="q-header">
        <span class="q-num">Q ${q.number}</span>
        <span class="q-type">${q.type === 'CQ' ? 'Creative Question (সৃজনশীল)' : q.type === 'MCQ' ? 'MCQ (বহুনির্বাচনী)' : 'Short Question'}</span>
        ${q.marks ? `<span class="q-marks">[Marks: ${q.marks}]</span>` : ''}
      </div>

      ${q.stem ? `<div class="q-stem"><strong>উদ্দীপক:</strong><br/>${q.stem.replace(/\n/g, '<br/>')}</div>` : ''}

      <div class="q-text">${q.text.replace(/\n/g, '<br/>')}</div>

      ${
        q.subQuestions && q.subQuestions.length > 0
          ? `<div class="sub-questions">
              ${q.subQuestions.map((sub) => `<div class="sub-q">${sub}</div>`).join('')}
            </div>`
          : ''
      }

      ${
        q.options && q.options.length > 0
          ? `<div class="mcq-options">
              ${q.options.map((opt) => `<div class="mcq-opt">${opt}</div>`).join('')}
            </div>`
          : ''
      }
    </div>
  `
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>NDC Quiz - ${paper.subject} - ${paper.batch}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Noto+Serif+Bengali:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 18mm 15mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Noto Sans Bengali', 'Noto Serif Bengali', -apple-system, sans-serif;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 0;
      font-size: 13.5pt;
      line-height: 1.6;
    }
    .exam-header {
      text-align: center;
      border-bottom: 2px solid #540F1D;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .college-name {
      font-family: 'Cinzel', 'Noto Serif Bengali', Georgia, serif;
      font-size: 19pt;
      font-weight: 700;
      color: #540F1D;
      letter-spacing: 0.5px;
      margin: 0 0 4px 0;
      text-transform: uppercase;
    }
    .exam-subtitle {
      font-size: 11pt;
      color: #555;
      margin: 0 0 6px 0;
      font-weight: 600;
    }
    .exam-meta-grid {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #ddd;
      padding-top: 8px;
      margin-top: 8px;
      font-size: 10pt;
      color: #333;
    }
    .exam-meta-item strong {
      color: #540F1D;
    }
    .question-block {
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px dashed #ccc;
      page-break-inside: avoid;
    }
    .question-block:last-child {
      border-bottom: none;
    }
    .q-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 10.5pt;
    }
    .q-num {
      background: #540F1D;
      color: #fff;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10pt;
    }
    .q-type {
      color: #444;
      font-size: 9.5pt;
      border: 1px solid #ccc;
      padding: 1px 6px;
      border-radius: 3px;
    }
    .q-marks {
      margin-left: auto;
      font-weight: bold;
      color: #540F1D;
      font-size: 10pt;
    }
    .q-stem {
      background: #fbf9f5;
      border-left: 3px solid #540F1D;
      padding: 8px 12px;
      margin: 8px 0;
      font-size: 12pt;
      color: #222;
      border-radius: 0 4px 4px 0;
    }
    .q-text {
      font-weight: 500;
      margin: 8px 0;
      color: #111;
    }
    .sub-questions {
      margin-left: 12px;
      margin-top: 6px;
    }
    .sub-q {
      margin-bottom: 5px;
      padding-left: 4px;
    }
    .mcq-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
      margin-top: 8px;
      font-size: 12pt;
    }
    .mcq-opt {
      padding: 3px 0;
    }
    .exam-footer {
      border-top: 1px solid #ccc;
      margin-top: 30px;
      padding-top: 8px;
      font-size: 8.5pt;
      color: #777;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
    }
    .print-controls {
      position: sticky;
      top: 0;
      background: #540F1D;
      color: #fff;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      z-index: 1000;
    }
    .print-btn {
      background: #D4AF37;
      color: #111;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12pt;
    }
    .print-btn:hover {
      background: #e5bf47;
    }
  </style>
</head>
<body>
  <div class="print-controls no-print">
    <div><strong>NDC Quiz Archive</strong> — Print Preview (${paper.subject} · ${paper.batch})</div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div style="padding: 15px 25px;">
    <div class="exam-header">
      <h1 class="college-name">NOTRE DAME COLLEGE, DHAKA</h1>
      <div class="exam-subtitle">
        ${paper.examHeader || `Weekly Quiz Examination · ${paper.quizRound}`}
      </div>
      <div class="exam-meta-grid">
        <div class="exam-meta-item"><strong>Subject:</strong> ${paper.subject} (${paper.subjectBn})</div>
        <div class="exam-meta-item"><strong>Batch:</strong> ${paper.batch} (${paper.session})</div>
        <div class="exam-meta-item"><strong>Group:</strong> ${paper.group}</div>
        <div class="exam-meta-item"><strong>Medium:</strong> ${paper.version}</div>
      </div>
    </div>

    <div class="questions-container">
      ${questionsHtml}
    </div>

    <div class="exam-footer">
      <span>NDC Quiz Archive · Official Student Digital Repository</span>
      <span>Preserved verbatim from historical Google Drive record ID: ${paper.fileId}</span>
    </div>
  </div>

  <script>
    // Automatically trigger print dialog when loaded
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printOriginalDocument(paper: ExamPaper) {
  // If it's an image, create a clean printable wrapper with the scanned paper centered on A4
  if (paper.format === 'image') {
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      window.open(paper.viewUrl, '_blank');
      return;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>NDC Quiz - Scanned Original - ${paper.subject} (${paper.batch})</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    body {
      margin: 0;
      padding: 0;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: sans-serif;
    }
    .print-bar {
      width: 100%;
      background: #540F1D;
      color: #fff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
    }
    .print-btn {
      background: #D4AF37;
      color: #111;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }
    .doc-container {
      width: 100%;
      max-width: 210mm;
      text-align: center;
      margin-top: 10px;
    }
    img {
      max-width: 100%;
      height: auto;
      max-height: 275mm;
      object-contain: contain;
    }
    .caption {
      font-size: 11px;
      color: #666;
      margin-top: 8px;
    }
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div><strong>NDC Scanned Quiz Paper:</strong> ${paper.subject} (${paper.batch} · ${paper.quizRound})</div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="doc-container">
    <img src="${paper.viewUrl}" alt="${paper.title}" onerror="this.src='${paper.previewUrl}';" />
    <div class="caption">
      Notre Dame College, Dhaka · ${paper.title} · Original Scanned Record from Google Drive
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 600);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // For PDF files, open direct download / PDF print URL
    window.open(paper.previewUrl, '_blank');
  }
}
