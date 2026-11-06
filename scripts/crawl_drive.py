import urllib.request
import re
import json
import time
from concurrent.futures import ThreadPoolExecutor

ROOT_ID = '1BW0InS-rnlLd3VienUaQLoKm14dj_ZEA'

def fetch_folder(folder_id, path=''):
    url = f'https://drive.google.com/drive/folders/{folder_id}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req, timeout=8).read().decode('utf-8', errors='ignore')
        chunks = html.split('[[null,"')
        items = []
        for c in chunks[1:]:
            parts = c.split('"', 2)
            fid = parts[0]
            if len(fid) < 15 or len(fid) > 50:
                continue
            t_match = re.search(r'\[\[\["([^"]+)"', c)
            mime_match = re.search(r'"(application\/[^"]+|image\/[^"]+)"', c)
            title = t_match.group(1) if t_match else 'Unknown'
            mime = mime_match.group(1) if mime_match else 'unknown'
            if title in ['Unknown', 'Name', 'Shared folder', 'Size not available', '']:
                continue
            item_path = f"{path}/{title}" if path else title
            items.append({
                'id': fid,
                'title': title,
                'mime': mime,
                'path': item_path,
                'parent_id': folder_id
            })
        return items
    except Exception as e:
        print(f"Error fetching {folder_id} ({path}): {e}")
        return []

def main():
    folders_to_crawl = [(ROOT_ID, "")]
    visited = set()
    all_files = []
    all_folders = []

    executor = ThreadPoolExecutor(max_workers=12)

    while folders_to_crawl:
        current_batch = []
        for fid, path in folders_to_crawl:
            if fid not in visited:
                visited.add(fid)
                current_batch.append((fid, path))
        folders_to_crawl = []

        if not current_batch:
            break

        print(f"Crawling {len(current_batch)} folders in parallel...")
        futures = [executor.submit(fetch_folder, fid, path) for fid, path in current_batch]
        for f in futures:
            items = f.result()
            for it in items:
                if 'folder' in it['mime']:
                    all_folders.append(it)
                    if it['id'] not in visited:
                        folders_to_crawl.append((it['id'], it['path']))
                else:
                    all_files.append(it)

    print(f"Total crawled: {len(all_folders)} folders, {len(all_files)} files.")
    
    unique_files = {}
    for f in all_files:
        if f['id'] not in unique_files:
            unique_files[f['id']] = f
    
    print(f"Unique examination files: {len(unique_files)}")
    
    with open('drive_files.json', 'w', encoding='utf-8') as out:
        json.dump(list(unique_files.values()), out, indent=2, ensure_ascii=False)
        
    with open('drive_folders.json', 'w', encoding='utf-8') as out:
        json.dump(all_folders, out, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()
