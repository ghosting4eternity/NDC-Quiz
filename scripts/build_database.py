import json
import re
import os

with open('drive_files.json', 'r', encoding='utf-8') as f:
    files = json.load(f)

extracted_samples = {}
if os.path.exists('extracted_samples.json'):
    try:
        with open('extracted_samples.json', 'r', encoding='utf-8') as ef:
            extracted_samples = json.load(ef)
    except Exception as e:
        print("Error reading extracted_samples.json:", e)

# Known subjects mapping
SUBJECT_MAP = [
    (r'physics|পদার্থ', 'Physics', 'পদার্থবিজ্ঞান', 'Science'),
    (r'chemistry|রসায়ন', 'Chemistry', 'রসায়ন', 'Science'),
    (r'higher\s*math|উচ্চতর\s*গণিত', 'Higher Mathematics', 'উচ্চতর গণিত', 'Science'),
    (r'biology|জীববিজ্ঞান', 'Biology', 'জীববিজ্ঞান', 'Science'),
    (r'bangla|বাংলা', 'Bangla', 'বাংলা', 'General'),
    (r'english|ইংরেজি', 'English', 'ইংরেজি', 'General'),
    (r'ict|তথ্য\s*ও\s*যোগাযোগ', 'ICT', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'General'),
    (r'accounting|হিসাববিজ্ঞান', 'Accounting', 'হিসাববিজ্ঞান', 'Business Studies'),
    (r'business\s*org|ব্যবসায়\s*সংগঠন', 'Business Organization', 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা', 'Business Studies'),
    (r'finance|ফিন্যান্স|অর্থায়ন', 'Finance, Banking & Insurance', 'ফিন্যান্স, ব্যাংকিং ও বীমা', 'Business Studies'),
    (r'economics|অর্থনীতি', 'Economics', 'অর্থনীতি', 'Humanities'),
    (r'statistics|পরিসংখ্যান', 'Statistics', 'পরিসংখ্যান', 'Science'),
    (r'civics|পৌরনীতি', 'Civics & Good Governance', 'পৌরনীতি ও সুশাসন', 'Humanities'),
    (r'geography|ভূগোল', 'Geography', 'ভূগোল', 'Humanities'),
    (r'logic|যুক্তিবিদ্যা', 'Logic', 'যুক্তিবিদ্যা', 'Humanities'),
    (r'sociology|সমাজবিজ্ঞান', 'Sociology', 'সমাজবিজ্ঞান', 'Humanities'),
    (r'islamic\s*history|ইতিহাস', 'Islamic History & Culture', 'ইসলামের ইতিহাস ও সংস্কৃতি', 'Humanities'),
    (r'social\s*work|সমাজকর্ম', 'Social Work', 'সমাজকর্ম', 'Humanities')
]

BATCH_SESSIONS = {
    'Batch 28': '2026-2028',
    'Batch 27': '2025-2027',
    'Batch 26': '2024-2026',
    'Batch 25': '2023-2025',
    'Batch 24': '2022-2024',
    'Batch 23': '2021-2023',
    'Batch 22': '2020-2022',
    'Batch 19': '2017-2019',
    'Batch 17': '2015-2017'
}

papers = []

for idx, item in enumerate(files):
    path = item['path']
    file_id = item['id']
    raw_title = item['title']
    mime = item.get('mime', '')

    # Extract Batch
    batch = "Unknown Batch"
    batch_num = 0
    b_match = re.search(r'Batch\s*(\d+)', path, re.IGNORECASE)
    if b_match:
        batch_num = int(b_match.group(1))
        batch = f"Batch {batch_num}"
    elif "NDC-2026" in path:
        batch = "Batch 26"
        batch_num = 26

    session = BATCH_SESSIONS.get(batch, "Historical Archive")

    # Extract Group
    group = "General"
    group_bn = "সাধারণ"
    if "Business Studies" in path:
        group = "Business Studies"
        group_bn = "ব্যবসায় শিক্ষা"
    elif "Humanities" in path:
        group = "Humanities"
        group_bn = "মানবিক"
    elif "Science" in path:
        group = "Science"
        group_bn = "বিজ্ঞান"

    # Extract Version
    version = "Bangla Version"
    if "[EV]" in path or "(EV)" in path or "EV" in raw_title:
        version = "English Version"
    elif "[BV]" in path or "(BV)" in path or "BV" in raw_title:
        version = "Bangla Version"
    elif "English" in raw_title and "Version" in path:
        version = "English Version"

    # Extract Subject
    subject = "Comprehensive Exam Compilation"
    subject_bn = "যৌথ পরীক্ষা সংকলন"
    found_subject = False
    for pattern, s_en, s_bn, def_grp in SUBJECT_MAP:
        if re.search(pattern, path, re.IGNORECASE):
            subject = s_en
            subject_bn = s_bn
            found_subject = True
            if group == "General" and def_grp != "General":
                group = def_grp
                group_bn = "বিজ্ঞান" if def_grp == "Science" else ("ব্যবসায় শিক্ষা" if def_grp == "Business Studies" else "মানবিক")
            break

    # Extract Round / Exam Type
    round_name = "Weekly Quiz"
    year_level = "Year 1"
    if "Year 2" in path or "২য় বর্ষ" in path or "2nd Year" in path:
        year_level = "Year 2"
    elif "Year 1" in path or "১ম বর্ষ" in path or "1st Year" in path:
        year_level = "Year 1"

    r_match = re.search(r'(Year\s*[12]\s*Round\s*\d+\s*(?:Promotion\s*)?Quiz|Year\s*[12]\s*Term(?:\s*\d+)?|Sent\s*Up(?:\s*\d+)?|Practical Exam)', path, re.IGNORECASE)
    if r_match:
        round_name = r_match.group(1).strip()
    elif "Quiz" in path:
        round_name = "Weekly Quiz"
    elif "Term" in path:
        round_name = "Term Examination"
    elif "Sent Up" in path or "Sentup" in path:
        round_name = "Sent Up Examination"

    # Clean title
    clean_title = f"{batch} · {round_name} · {subject}"
    if version == "English Version":
        clean_title += " [EV]"
    elif version == "Bangla Version" and found_subject:
        clean_title += " [BV]"

    is_pdf = 'pdf' in mime.lower() or raw_title.lower().endswith('.pdf')
    doc_format = "pdf" if is_pdf else "image"

    # Check extracted questions
    q_data = extracted_samples.get(file_id, {})
    questions = q_data.get('questions', [])
    exam_header = q_data.get('examHeader', None)

    paper_record = {
        "id": f"paper-{file_id}",
        "fileId": file_id,
        "batch": batch,
        "batchNumber": batch_num,
        "session": session,
        "group": group,
        "groupBn": group_bn,
        "subject": subject,
        "subjectBn": subject_bn,
        "version": version,
        "quizRound": round_name,
        "yearLevel": year_level,
        "format": doc_format,
        "title": clean_title,
        "originalFileName": raw_title,
        "originalPath": path,
        "driveUrl": f"https://drive.google.com/file/d/{file_id}/view",
        "previewUrl": f"https://drive.google.com/file/d/{file_id}/preview",
        "downloadUrl": f"https://drive.google.com/uc?export=download&id={file_id}",
        "viewUrl": f"https://lh3.googleusercontent.com/d/{file_id}",
        "verified": True,
        "hasExtractedQuestions": len(questions) > 0,
        "examHeader": exam_header,
        "questionsCount": len(questions),
        "questions": [
            {
                "id": f"q-{file_id}-{q.get('number', i+1)}",
                "paperId": f"paper-{file_id}",
                "number": str(q.get('number', i+1)),
                "type": q.get('type', 'CQ'),
                "stem": q.get('stem'),
                "text": q.get('text', ''),
                "subQuestions": q.get('subQuestions', []),
                "options": q.get('options', []),
                "marks": q.get('marks'),
                "subject": subject,
                "subjectBn": subject_bn,
                "batch": batch,
                "quizRound": round_name,
                "yearLevel": year_level,
                "group": group
            }
            for i, q in enumerate(questions)
        ]
    }
    papers.append(paper_record)

print(f"Processed {len(papers)} examination records.")

# Also add the Physics paper from earlier test if not in extracted_samples
physics_file_id = '1n6V0Tv6JhmC0mDHxgLZgsFtS9Ib2bD2U'
for p in papers:
    if p['fileId'] == physics_file_id and not p['questions']:
        p['hasExtractedQuestions'] = True
        p['examHeader'] = "Notre Dame College, Dhaka · Weekly Quiz · Physics"
        p['questions'] = [
            {
                "id": f"q-{physics_file_id}-1",
                "paperId": p['id'],
                "number": "1",
                "type": "MCQ",
                "stem": None,
                "text": "(2i + 2j - 2k) এবং (2i - j + 2k) ভেক্টরের যোগফলের সাথে কোন ভেক্টরের যোগ করলে লব্ধি ভেক্টর হিসেবে k পাওয়া যাবে?",
                "subQuestions": [],
                "options": ["(ক) -4i - j + k", "(খ) -4i - j", "(গ) 4i + j + k", "(ঘ) -4i + j + k"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-2",
                "paperId": p['id'],
                "number": "2",
                "type": "MCQ",
                "stem": None,
                "text": "কোনটি বণ্টন সূত্র?",
                "subQuestions": [],
                "options": ["(ক) A · (B + C) = A · B + A · C", "(খ) A + B = B + A", "(গ) A · B = B · A", "(ঘ) (A · B) · C = A · (B · C)"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-3",
                "paperId": p['id'],
                "number": "3",
                "type": "MCQ",
                "stem": None,
                "text": "ভিন্নজাতীয় ভেক্টর: i. সদৃশ ভেক্টর ii. সমান ভেক্টর iii. সমরেখ ভেক্টর। নিচের কোনটি সঠিক?",
                "subQuestions": [],
                "options": ["(ক) i ও ii", "(খ) i ও iii", "(গ) ii ও iii", "(ঘ) i, ii ও iii"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-4",
                "paperId": p['id'],
                "number": "4",
                "type": "MCQ",
                "stem": "উদ্দীপকটি পড় এবং ৪ ও ৫ নং প্রশ্নের উত্তর দাও:\nবাতাসের বেগ V_air = 5 m/min, নৌকার ১ম মাঝি কর্তৃক প্রদত্ত বেগ V_1 = 10 m/min, স্রোতের বেগ u = 5 m/min, V_2 = ২য় মাঝি কর্তৃক প্রদত্ত বেগ।",
                "text": "দ্বিতীয় মাঝির উপস্থিতিতে নৌকাটি অপর পাড়ে পৌঁছাতে কত সময় লাগবে?",
                "subQuestions": [],
                "options": ["(ক) 10 min", "(খ) 12 min", "(গ) 15 min", "(ঘ) 8 min"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-5",
                "paperId": p['id'],
                "number": "5",
                "type": "MCQ",
                "stem": "উদ্দীপকটি পড় এবং ৪ ও ৫ নং প্রশ্নের উত্তর দাও:\nবাতাসের বেগ V_air = 5 m/min, নৌকার ১ম মাঝি কর্তৃক প্রদত্ত বেগ V_1 = 10 m/min, স্রোতের বেগ u = 5 m/min, V_2 = ২য় মাঝি কর্তৃক প্রদত্ত বেগ।",
                "text": "উভয় মাঝির উপস্থিতিতে V_2 এর মান কত হলে নৌকাটি সোজাসুজি অপর পাড়ে পৌঁছাবে?",
                "subQuestions": [],
                "options": ["(ক) 5 m/min", "(খ) 8.66 m/min", "(গ) 10 m/min", "(ঘ) 15 m/min"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-6",
                "paperId": p['id'],
                "number": "6",
                "type": "MCQ",
                "stem": None,
                "text": "P = 5i - 6j + 7k, Q = 15i + 18j + 21k ভেক্টরদ্বয় সমান্তরাল হলে নিচের কোন শর্তটি সঠিক?",
                "subQuestions": [],
                "options": ["(ক) P × Q = 0", "(খ) P · Q = 0", "(গ) P + Q = 0", "(ঘ) |P| = |Q|"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-7",
                "paperId": p['id'],
                "number": "7",
                "type": "MCQ",
                "stem": None,
                "text": "A = i + j, B = -j, C = k হলে নিচের কোনটি সত্য?",
                "subQuestions": [],
                "options": ["(ক) A · (B × C) = -1", "(খ) A × B = k", "(গ) A · B = 0", "(ঘ) B × C = i"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-8",
                "paperId": p['id'],
                "number": "8",
                "type": "MCQ",
                "stem": None,
                "text": "0.5i + 0.5j + tk একটি একক ভেক্টর হলে t এর মান কত?",
                "subQuestions": [],
                "options": ["(ক) 1/√2", "(খ) 1/2", "(গ) √2", "(ঘ) 0"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-9",
                "paperId": p['id'],
                "number": "9",
                "type": "MCQ",
                "stem": None,
                "text": "P + Q = R এবং |P| = |Q| = |R| হলে P এবং Q এর মধ্যবর্তী কোণের (α) ক্ষেত্রে কোনটি সত্য?",
                "subQuestions": [],
                "options": ["(ক) α = 60°", "(খ) α = 90°", "(গ) α = 120°", "(ঘ) α = 180°"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-10",
                "paperId": p['id'],
                "number": "10",
                "type": "MCQ",
                "stem": None,
                "text": "একজন লোক V_p বেগে θ কোণে আনত তল দিয়ে নিচের দিকে নামছে। এই অবস্থায় তাঁর উপর বৃষ্টি তলের সাপেক্ষে লম্বভাবে পড়ছে। বৃষ্টির প্রকৃত বেগ V_r হলে V_p এবং V_r মধ্যবর্তী কোণ-",
                "subQuestions": [],
                "options": ["(ক) 90° - θ", "(খ) 90° + θ", "(গ) 180° - θ", "(ঘ) θ"],
                "marks": "1",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            },
            {
                "id": f"q-{physics_file_id}-11",
                "paperId": p['id'],
                "number": "11",
                "type": "CQ",
                "stem": "মেসি ও নেইমার একবিন্দুতে দাঁড়িয়ে। নেইমার মাটি ঘেঁষে বলটিকে সামনে পাঠিয়ে দিলে মেসি বল ধরার জন্য 36° কোণে উত্তর-পূর্বদিকে 3m, এরপর পূর্বদিকে 3m এবং সবশেষে উত্তর দিক বরাবর 5m দৌড়িয়ে সেই বলটিকে ধরতে পারল। [XY তলে বিবেচনা করতে হবে]",
                "text": "সৃজনশীল প্রশ্ন:",
                "subQuestions": [
                    "(ক) লব্ধি ভেক্টর কি?",
                    "(খ) A = i cos θ + j sin θ হলে এর লম্ব ভেক্টর B কি হবে ব্যাখ্যা কর। [A ও B এর মান A এবং B]",
                    "(গ) পূর্বদিক বরাবর মেসির ১ম সরণ ভেক্টরের লম্ব অভিক্ষেপ নির্ণয় কর।",
                    "(ঘ) মেসি কিভাবে নেইমারের বলটি ধরতে পেরেছিল তা ভেক্টরের সাহায্যে বলের গতিপ্রকৃতি নির্ণয়পূর্বক গাণিতিক ও সঠিক চিত্রের সাহায্যে বিশ্লেষণ কর।"
                ],
                "options": [],
                "marks": "10",
                "subject": "Physics",
                "subjectBn": "পদার্থবিজ্ঞান",
                "batch": "Batch 26",
                "quizRound": "Year 1 Round 1 Quiz",
                "yearLevel": "Year 1",
                "group": "Science"
            }
        ]
        p['questionsCount'] = len(p['questions'])

os.makedirs('src/data', exist_ok=True)
with open('src/data/papersData.json', 'w', encoding='utf-8') as out:
    json.dump(papers, out, indent=2, ensure_ascii=False)

print(f"Successfully saved {len(papers)} papers to src/data/papersData.json")
