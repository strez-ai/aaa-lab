# Rebuilds content.json (cards + exam questions) and index.html (app.html with drills.js inlined).
import json, hashlib, sys, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(root, 'src') + '/'
cards = []; seen = set()
for subj, fn in [('psych', 'psych.txt'), ('maths', 'maths.txt'), ('econ', 'econ.txt')]:
    topic = None
    for n, line in enumerate(open(src + fn, encoding='utf8'), 1):
        line = line.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('# '): topic = line[2:].strip(); continue
        if ' :: ' not in line: sys.exit(f'{fn}:{n} bad line')
        q, a = line.split(' :: ', 1)
        cid = hashlib.md5((topic + '|' + q).encode()).hexdigest()[:8]
        if cid in seen: sys.exit(f'dup {fn}:{n} {q}')
        seen.add(cid)
        cards.append([cid, topic, q.strip(), a.strip()])
# Ready-made subject packs: src/library/<id>.txt -> library/<id>.json, loaded when a student adds that subject.
# Header lines: @name, @aliases (|-separated), @board, @code. Topics: "# topic-id | spec ref | Topic name".
lib = []; libdir = os.path.join(src, 'library'); outdir = os.path.join(root, 'library')
os.makedirs(outdir, exist_ok=True)
for fn in sorted(os.listdir(libdir)) if os.path.isdir(libdir) else []:
    if not fn.endswith('.txt'): continue
    pid = fn[:-4]; meta = {}; topics = []; pcards = []; pseen = set(); tids = set(); tid = None
    for n, line in enumerate(open(os.path.join(libdir, fn), encoding='utf8'), 1):
        line = line.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('@'):
            k, _, v = line[1:].partition(' '); meta[k] = v.strip(); continue
        if line.startswith('# '):
            parts = [x.strip() for x in line[2:].split('|')]
            if len(parts) != 3: sys.exit(f'{fn}:{n} topic line needs "id | spec | name"')
            tid = pid + ':' + parts[0]
            if tid in tids: sys.exit(f'{fn}:{n} duplicate topic id')
            tids.add(tid); topics.append({'id': tid, 'spec': parts[1], 'name': parts[2]}); continue
        if ' :: ' not in line or not tid: sys.exit(f'{fn}:{n} bad line')
        q, a = line.split(' :: ', 1)
        cid = 'L' + hashlib.md5((tid + '|' + q).encode()).hexdigest()[:8]
        if cid in pseen or cid in seen: sys.exit(f'dup {fn}:{n} {q}')
        pseen.add(cid); pcards.append([cid, tid, q.strip(), a.strip()])
    for k in ('name', 'board'):
        if k not in meta: sys.exit(f'{fn}: missing @{k}')
    empty = [t['name'] for t in topics if not any(c[1] == t['id'] for c in pcards)]
    if empty: sys.exit(f'{fn}: topics with no cards: {empty}')
    open(os.path.join(outdir, pid + '.json'), 'w', encoding='utf8').write(json.dumps({'id': pid, 'topics': topics, 'cards': pcards}, ensure_ascii=False, separators=(',', ':')))
    lib.append({'id': pid, 'name': meta['name'], 'names': [meta['name']] + [x.strip() for x in meta.get('aliases', '').split('|') if x.strip()], 'board': meta['board'].split('|')[0].strip(), 'boards': [x.strip() for x in meta['board'].split('|')], 'code': meta.get('code', ''), 't': len(topics), 'n': len(pcards)})
    print(f'  {pid}: {len(topics)} topics, {len(pcards)} cards')
exam = json.load(open(src + 'exam.json', encoding='utf8'))
ids = [q['id'] for q in exam]
if len(ids) != len(set(ids)): sys.exit('duplicate exam question id')
s = json.dumps({'cards': cards, 'exam': exam, 'lib': lib}, ensure_ascii=False, separators=(',', ':'))
open(os.path.join(root, 'content.json'), 'w', encoding='utf8').write(s)
app = open(src + 'app.html', encoding='utf8').read()
assert app.count('/*DRILLS*/') == 1
open(os.path.join(root, 'index.html'), 'w', encoding='utf8').write(app.replace('/*DRILLS*/', open(src + 'drills.js', encoding='utf8').read().rstrip('\n')))
print(len(cards), 'cards,', len(exam), 'exam questions,', len(s) // 1024, 'KB')
