import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import https from 'https';

const ai = new GoogleGenAI();

async function downloadFile(id: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `https://drive.google.com/uc?export=download&id=${id}`;
    https.get(url, (res) => {
      // follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirRes) => {
          const stream = fs.createWriteStream(dest);
          redirRes.pipe(stream);
          stream.on('finish', () => { stream.close(); resolve(true); });
          stream.on('error', () => resolve(false));
        }).on('error', () => resolve(false));
      } else {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => { stream.close(); resolve(true); });
        stream.on('error', () => resolve(false));
      }
    }).on('error', () => resolve(false));
  });
}

const targetPapers = [
  { id: '1g8IycqoeneS1kz5JYMeP2fwuDvHi-dSJ', name: 'Chemistry_BV', subject: 'Chemistry', mime: 'image/jpeg' },
  { id: '1C5YXLl9Ev10Ps7erJjBQyXU8m19hx-E7', name: 'Bangla_BV', subject: 'Bangla', mime: 'image/jpeg' },
  { id: '1Xg5q_RKdKGbRTK1kFfh3pXky4cUVs9NF', name: 'HigherMath_BV', subject: 'Higher Mathematics', mime: 'image/png' },
  { id: '1BndxGOpx5_S0_L0MHqezQ7z8mVFYu9rZ', name: 'English_BV', subject: 'English', mime: 'image/jpeg' },
  { id: '11k9no1TmahWPkBYUl_IyXBSfERlcpEEQ', name: 'English_EV', subject: 'English', mime: 'image/jpeg' }
];

async function main() {
  const extractedMap: Record<string, any> = {};

  for (const paper of targetPapers) {
    const tmpPath = `/tmp/${paper.name}.${paper.mime.split('/')[1]}`;
    console.log(`Downloading ${paper.name} (${paper.id})...`);
    const ok = await downloadFile(paper.id, tmpPath);
    if (!ok || !fs.existsSync(tmpPath) || fs.statSync(tmpPath).size < 1000) {
      console.log(`Failed to download ${paper.name}`);
      continue;
    }

    console.log(`Extracting questions from ${paper.name}... size: ${fs.statSync(tmpPath).size} bytes`);
    const base64 = fs.readFileSync(tmpPath).toString('base64');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: paper.mime, data: base64 } },
              {
                text: `Examine this Notre Dame College exam paper image.
Strictly extract all visible questions exactly as printed.
Rules:
- DO NOT solve any question or provide answers/explanations.
- Preserve exact Bengali and English words, mathematical expressions, sub-questions ((ক), (খ), (গ), (ঘ) / (a), (b), (c), (d)), options ((ক), (খ), (গ), (ঘ)), marks, and question numbers.
- Return ONLY valid JSON in this structure:
{
  "examHeader": "string or null",
  "questions": [
    {
      "number": "string",
      "type": "CQ" | "MCQ" | "Short",
      "stem": "string or null (উদ্দীপক or passage if any)",
      "text": "string (the main question text)",
      "subQuestions": ["string", "string"],
      "options": ["string", "string", "string", "string"],
      "marks": "string or null"
    }
  ]
}`
              }
            ]
          }
        ]
      });

      let jsonStr = response.text || '';
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(jsonStr);
      extractedMap[paper.id] = parsed;
      console.log(`Successfully extracted ${parsed.questions?.length || 0} questions for ${paper.name}!`);
    } catch (e: any) {
      console.error(`Error extracting ${paper.name}:`, e.message || e);
    }
  }

  fs.writeFileSync('extracted_samples.json', JSON.stringify(extractedMap, null, 2));
  console.log('Saved extracted_samples.json');
}

main();
