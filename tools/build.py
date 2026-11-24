import json, hashlib, sys, re
import os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src=os.path.join(root,'src')+'/'
cards=[]; seen=set()
for subj,fn in [('psych','psych.txt'),('maths','maths.txt'),('econ','econ.txt')]:
    topic=None
    for n,line in enumerate(open(src+fn,encoding='utf8'),1):
        line=line.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('# '): topic=line[2:].strip(); continue
        if ' :: ' not in line: sys.exit(f'{fn}:{n} bad line')
        q,a=line.split(' :: ',1)
        cid=hashlib.md5((topic+'|'+q).encode()).hexdigest()[:8]
        if cid in seen: sys.exit(f'dup {fn}:{n} {q}')
        seen.add(cid)
        cards.append([cid,topic,q.strip(),a.strip()])
exam=json.load(open(src+'exam.json',encoding='utf8'))
out={'cards':cards,'exam':exam}
s=json.dumps(out,ensure_ascii=False,separators=(',',':'))
open(os.path.join(root,'content.json'),'w',encoding='utf8').write(s)
from collections import Counter
print(len(cards), len(s)//1024,'KB'); print(Counter(c[1] for c in cards))
