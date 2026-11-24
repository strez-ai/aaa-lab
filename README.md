# AAA Lab

A-level revision app (Psychology, Maths, Economics), hosted on GitHub Pages and installable on a phone.

- `index.html` is the app; `content.json` holds the cards and exam questions.
- Edit cards in `src/*.txt` and `src/exam.json`, then run `python3 tools/build.py` to rebuild `content.json`.
- `sw.js` makes it work offline; bump `CACHE` in it if an update doesn't show up.

No API keys live in this repo. An optional key is saved only in the browser on your own device.
