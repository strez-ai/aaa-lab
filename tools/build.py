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
# Header lines: @name, @aliases (|-separated), @board (|-separated if the content suits several boards), @code.
# Topics: "# topic-id | spec ref | Topic name", then "question :: answer" cards.
# "+ source" under a topic copies cards from elsewhere: "+ builtin:e-1.2" (a built-in topic) or "+ bio-aqa:cells" (another pack's topic).
lib = []; libdir = os.path.join(src, 'library'); outdir = os.path.join(root, 'library')
os.makedirs(outdir, exist_ok=True)
raw = {}
for fn in sorted(os.listdir(libdir)) if os.path.isdir(libdir) else []:
    if not fn.endswith('.txt'): continue
    pid = fn[:-4]; meta = {}; topics = []; tid = None
    for n, line in enumerate(open(os.path.join(libdir, fn), encoding='utf8'), 1):
        line = line.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('@'):
            k, _, v = line[1:].partition(' '); meta[k] = v.strip(); continue
        if line.startswith('# '):
            parts = [x.strip() for x in line[2:].split('|')]
            if len(parts) != 3: sys.exit(f'{fn}:{n} topic line needs "id | spec | name"')
            if any(t['slug'] == parts[0] for t in topics): sys.exit(f'{fn}:{n} duplicate topic id')
            topics.append({'slug': parts[0], 'spec': parts[1], 'name': parts[2], 'items': []}); continue
        if not topics: sys.exit(f'{fn}:{n} card before any topic')
        if line.startswith('+ '): topics[-1]['items'].append(('inc', line[2:].strip(), f'{fn}:{n}')); continue
        if ' :: ' not in line: sys.exit(f'{fn}:{n} bad line')
        q, a = line.split(' :: ', 1); topics[-1]['items'].append(('card', q.strip(), a.strip()))
    for k in ('name', 'board'):
        if k not in meta: sys.exit(f'{fn}: missing @{k}')
    raw[pid] = (meta, topics)
builtin = {}
for c in cards: builtin.setdefault(c[1], []).append((c[2], c[3]))
def own_cards(pid, slug):
    for t in raw[pid][1]:
        if t['slug'] == slug: return [(it[1], it[2]) for it in t['items'] if it[0] == 'card']
    return None
for pid, (meta, topics) in raw.items():
    out_topics = []; pcards = []; pseen = set()
    for t in topics:
        tid = pid + ':' + t['slug']; out_topics.append({'id': tid, 'spec': t['spec'], 'name': t['name']}); have = set()
        for it in t['items']:
            if it[0] == 'card': pairs = [(it[1], it[2])]
            else:
                srcp, _, slug = it[1].partition(':')
                pairs = builtin.get(slug) if srcp == 'builtin' else (own_cards(srcp, slug) if srcp in raw else None)
                if not pairs: sys.exit(f'{it[2]}: nothing to include from {it[1]}')
            for q, a in pairs:
                if q.lower() in have: continue
                have.add(q.lower())
                cid = 'L' + hashlib.md5((tid + '|' + q).encode()).hexdigest()[:8]
                if cid in pseen or cid in seen: sys.exit(f'dup in {pid}: {q}')
                pseen.add(cid); pcards.append([cid, tid, q, a])
    empty = [t['name'] for t in out_topics if not any(c[1] == t['id'] for c in pcards)]
    if empty: sys.exit(f'{pid}: topics with no cards: {empty}')
    open(os.path.join(outdir, pid + '.json'), 'w', encoding='utf8').write(json.dumps({'id': pid, 'topics': out_topics, 'cards': pcards}, ensure_ascii=False, separators=(',', ':')))
    boards = [x.strip() for x in meta['board'].split('|')]
    lib.append({'id': pid, 'name': meta['name'], 'names': [meta['name']] + [x.strip() for x in meta.get('aliases', '').split('|') if x.strip()], 'board': boards[0], 'boards': boards, 'code': meta.get('code', ''), 't': len(out_topics), 'n': len(pcards)})
    print(f'  {pid}: {len(out_topics)} topics, {len(pcards)} cards')
exam = json.load(open(src + 'exam.json', encoding='utf8'))
ids = [q['id'] for q in exam]
if len(ids) != len(set(ids)): sys.exit('duplicate exam question id')
s = json.dumps({'cards': cards, 'exam': exam, 'lib': lib}, ensure_ascii=False, separators=(',', ':'))
open(os.path.join(root, 'content.json'), 'w', encoding='utf8').write(s)
app = open(src + 'app.html', encoding='utf8').read()
assert app.count('/*DRILLS*/') == 1
open(os.path.join(root, 'index.html'), 'w', encoding='utf8').write(app.replace('/*DRILLS*/', open(src + 'drills.js', encoding='utf8').read().rstrip('\n')))
print(len(cards), 'cards,', len(exam), 'exam questions,', len(s) // 1024, 'KB')
