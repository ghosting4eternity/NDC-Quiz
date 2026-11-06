import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import https from 'https';

const ai = new GoogleGenAI();

async function downloadFile(id: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `https://drive.google.com/uc?export=download&id=${id}`;
    https.get(url, (res) => {
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

const batch2 = [
  { id: '1OqWSfO8kf7pOyOela9Z45SQlBgGO1uMn', name: 'Biology_R2', mime: 'image/jpeg' },
  { id: '1Fu3FchbuhE41Fy-bXAE-uztPqoM-9X2j', name: 'ICT_R2', mime: 'image/jpeg' },
  { id: '1lPWwn1aZrxBZmYsrsp3zWKIwSK5AqfeY', name: 'Math_R2', mime: 'image/png' },
  { id: '1VQ9Gu4oHOVt4ETk09ll-heF6IQu-EmeC', name: 'Accounting_B24', mime: 'image/jpeg' },
  { id: '1P_r5bo1VLvF-iJp3AiFj7pk69Uhxz0WH', name: 'Economics_B24', mime: 'image/jpeg' }
];

async function main() {
  let existing: Record<string, any> = {};
  if (fs.existsSync('extracted_samples.json')) {
    existing = JSON.parse(fs.readFileSync('extracted_samples.json', 'utf8'));
  }

  for (const item of batch2) {
    const tmpPath = `/tmp/${item.name}.${item.mime.split('/')[1]}`;
    console.log(`Downloading ${item.name}...`);
    const ok = await downloadFile(item.id, tmpPath);
    if (!ok || !fs.existsSync(tmpPath) || fs.statSync(tmpPath).size < 1000) {
      console.log(`Failed to download ${item.name}`);
      continue;
    }

    console.log(`Extracting ${item.name}...`);
    const base64 = fs.readFileSync(tmpPath).toString('base64');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: item.mime, data: base64 } },
              {
                text: `Examine this Notre Dame College exam paper image.
Strictly extract all visible questions exactly as printed.
Rules:
- DO NOT solve any question or provide answers/explanations.
- Preserve exact Bengali and English words, mathematical expressions, sub-questions ((ক), (খ), (গ), (ঘ)), options, marks, and question numbers.
- Return ONLY valid JSON in this structure:
{
  "examHeader": "string or null",
  "questions": [
    {
      "number": "string",
      "type": "CQ" | "MCQ" | "Short",
      "stem": "string or null",
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
      existing[item.id] = parsed;
      console.log(`Extracted ${parsed.questions?.length || 0} questions for ${item.name}!`);
    } catch (e: any) {
      console.error(`Error on ${item.name}:`, e.message || e);
    }
  }

  fs.writeFileSync('extracted_samples.json', JSON.stringify(existing, null, 2));
  console.log('Updated extracted_samples.json with batch 2');
}

main();
