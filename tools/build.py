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
exam = json.load(open(src + 'exam.json', encoding='utf8'))
ids = [q['id'] for q in exam]
if len(ids) != len(set(ids)): sys.exit('duplicate exam question id')
s = json.dumps({'cards': cards, 'exam': exam}, ensure_ascii=False, separators=(',', ':'))
open(os.path.join(root, 'content.json'), 'w', encoding='utf8').write(s)
app = open(src + 'app.html', encoding='utf8').read()
assert app.count('/*DRILLS*/') == 1
open(os.path.join(root, 'index.html'), 'w', encoding='utf8').write(app.replace('/*DRILLS*/', open(src + 'drills.js', encoding='utf8').read().rstrip('\n')))
print(len(cards), 'cards,', len(exam), 'exam questions,', len(s) // 1024, 'KB')
