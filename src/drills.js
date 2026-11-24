// Maths question generators. Each returns {q, ans, dp, sol, unit}
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const nz = (a, b) => { let x = 0; while (x === 0) x = R(a, b); return x; };
const sgn = (n, first) => (n < 0 ? (first ? '−' : ' − ') + Math.abs(n) : (first ? '' : ' + ') + n);
const term = (c, v, first) => {
  if (c === 0) return '';
  const a = Math.abs(c);
  const coef = a === 1 && v ? '' : String(a);
  const s = c < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ');
  return s + coef + v;
};
const poly = (terms) => { let out = ''; terms.forEach(([c, v]) => { const t = term(c, v, out === ''); out += t; }); return out || '0'; };
const comb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
function erf(x) { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const fmt = (x, dp) => Number(x.toFixed(dp)).toString();
const G = 9.8;

const GEN = {
  'm-diff': [
    () => { const a = R(2, 5), b = R(-4, 5), n = R(3, 5), x = R(0, 2); const ans = n * a * Math.pow(a * x + b, n - 1);
      return { q: `Use the chain rule to find the gradient of y = (${a}x${sgn(b)})${['', '', '', '³', '⁴', '⁵'][n]} at x = ${x}.`, ans, dp: 0, sol: `dy/dx = ${n}(${a})(${a}x${sgn(b)})${['', '', '', '²', '³', '⁴'][n]} = ${n * a}(${a * x + b})${['', '', '', '²', '³', '⁴'][n]} = ${ans}.` }; },
    () => { const c = R(1, 9), x = R(1, 4); const ans = 2 * x / (x * x + c);
      return { q: `Find the gradient of y = ln(x² + ${c}) at x = ${x}, to 3 d.p.`, ans, dp: 3, sol: `dy/dx = 2x/(x² + ${c}) = ${2 * x}/${x * x + c} = ${fmt(ans, 5)}.` }; },
    () => { const a = nz(-2, 3), b = R(-5, 5), x = nz(-2, 3); const m = 2 * a * x + b; if (m === 0) return GEN['m-diff'][0](); const ans = -1 / m;
      return { q: `Find the gradient of the normal to y = ${poly([[a, 'x²'], [b, 'x']])} at x = ${x}, to 3 d.p. if needed.`, ans, dp: 3, sol: `dy/dx = ${poly([[2 * a, 'x'], [b, '']])} = ${m} at x = ${x}. Normal gradient = −1/${m} = ${fmt(ans, 4)}.` }; },
    () => { const a = nz(-3, 4), b = R(-6, 6), c = R(-9, 9), k = nz(-3, 3);
      const ans = 3 * a * k * k + 2 * b * k + c;
      return { q: `Find the gradient of y = ${poly([[a, 'x³'], [b, 'x²'], [c, 'x']])} at x = ${k}.`, ans, dp: 0,
        sol: `dy/dx = ${poly([[3 * a, 'x²'], [2 * b, 'x'], [c, '']])}. At x = ${k}: ${3 * a}(${k})² ${sgn(2 * b * k)} ${sgn(c)} = ${ans}.` }; },
    () => { const a = nz(-4, 5), b = R(-12, 12), c = R(-9, 9); const ans = -b / (2 * a);
      return { q: `Find the x-coordinate of the stationary point of y = ${poly([[a, 'x²'], [b, 'x'], [c, '']])}. Give your answer to 2 d.p. if needed.`, ans, dp: 2,
        sol: `dy/dx = ${poly([[2 * a, 'x'], [b, '']])} = 0, so x = ${-b}/${2 * a} = ${fmt(ans, 4)}.` }; },
    () => { const n = R(2, 4), k = R(1, 2); const ans = (n * Math.pow(k, n - 1) + Math.pow(k, n)) * Math.exp(k);
      return { q: `Use the product rule to find the gradient of y = x${n === 2 ? '²' : n === 3 ? '³' : '⁴'}eˣ at x = ${k}. Give your answer to 3 d.p.`, ans, dp: 3,
        sol: `dy/dx = ${n}x${n - 1 === 1 ? '' : n - 1 === 2 ? '²' : '³'}eˣ + x${n === 2 ? '²' : n === 3 ? '³' : '⁴'}eˣ. At x = ${k}: (${n * Math.pow(k, n - 1)} + ${Math.pow(k, n)})e${k === 1 ? '' : '²'} = ${fmt(ans, 4)}.` }; },
    () => { const a = R(2, 5), b = R(1, 6), n = R(3, 5); const x = R(0, 2); const ans = n * a * Math.pow(a * x + b, n - 1);
      return { q: `Use the chain rule to find dy/dx when x = ${x}, for y = (${a}x + ${b})^${n}.`, ans, dp: 0,
        sol: `dy/dx = ${n} × ${a}(${a}x + ${b})^${n - 1}. At x = ${x}: ${n * a} × ${a * x + b}^${n - 1} = ${ans}.` }; },
  ],
  'm-int': [
    () => { const p = R(-3, 4), q = R(-5, 5), r = R(-6, 6), a = R(-1, 1), b = a + R(1, 3);
      const F = (x) => p * x ** 3 / 3 + q * x * x / 2 + r * x; const ans = F(b) - F(a);
      return { q: `Evaluate ∫ from ${a} to ${b} of (${poly([[p, 'x²'], [q, 'x'], [r, '']])}) dx. Give your answer to 3 d.p. if needed.`, ans, dp: 3,
        sol: `Integral = [${p}x³/3 ${sgn(q)}x²/2 ${sgn(r)}x] from ${a} to ${b} = ${fmt(F(b), 4)} − (${fmt(F(a), 4)}) = ${fmt(ans, 4)}.` }; },
    () => { const k = R(2, 9), b = R(2, 6); const ans = k * Math.log(b);
      return { q: `Find the exact value of ∫ from 1 to ${b} of ${k}/x dx, then give it to 3 d.p.`, ans, dp: 3,
        sol: `∫ ${k}/x dx = ${k} ln x. From 1 to ${b}: ${k} ln ${b} − ${k} ln 1 = ${k} ln ${b} ≈ ${fmt(ans, 4)}.` }; },
    () => { const k = R(2, 4), m = R(1, 3); const ans = (Math.exp(k * m) - 1) / k;
      return { q: `Evaluate ∫ from 0 to ${m} of e^(${k}x) dx to 3 d.p.`, ans, dp: 3,
        sol: `∫ e^(${k}x) dx = (1/${k})e^(${k}x). From 0 to ${m}: (e^${k * m} − 1)/${k} ≈ ${fmt(ans, 4)}.` }; },
  ],
  'm-seq': [
    () => { const a = R(-5, 12), d = nz(-4, 6), n = R(10, 40); const ans = n / 2 * (2 * a + (n - 1) * d);
      return { q: `An arithmetic series has first term ${a} and common difference ${d}. Find the sum of the first ${n} terms.`, ans, dp: 0,
        sol: `Sₙ = n/2 (2a + (n − 1)d) = ${n}/2 × (${2 * a} + ${(n - 1) * d}) = ${ans}.` }; },
    () => { const a = R(4, 60); const [num, den] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [-1, 2], [-1, 3]]); const r = num / den; const ans = a / (1 - r);
      return { q: `A geometric series has first term ${a} and common ratio ${num}/${den}. Find the sum to infinity (2 d.p. if needed).`, ans, dp: 2,
        sol: `|r| < 1, so S∞ = a/(1 − r) = ${a}/(1 − (${num}/${den})) = ${fmt(ans, 4)}.` }; },
    () => { const a = R(1, 3), b = nz(-3, 4), n = R(4, 7), k = R(2, 3); const ans = comb(n, k) * Math.pow(a, n - k) * Math.pow(b, k);
      return { q: `Find the coefficient of x${k === 2 ? '²' : '³'} in the expansion of (${a} ${b < 0 ? '−' : '+'} ${Math.abs(b)}x)^${n}.`, ans, dp: 0,
        sol: `Term = ${n}C${k} × ${a}^${n - k} × (${b}x)^${k} = ${comb(n, k)} × ${Math.pow(a, n - k)} × ${Math.pow(b, k)} = ${ans}.` }; },
    () => { const a = R(2, 9), r = pick([2, 3, 1.5, 0.5]), n = R(5, 9); const ans = a * (1 - Math.pow(r, n)) / (1 - r);
      return { q: `Find the sum of the first ${n} terms of a geometric series with first term ${a} and common ratio ${r} (2 d.p. if needed).`, ans, dp: 2,
        sol: `Sₙ = a(1 − rⁿ)/(1 − r) = ${a}(1 − ${r}^${n})/(1 − ${r}) = ${fmt(ans, 4)}.` }; },
  ],
  'm-exp': [
    () => { const a = pick([2, 3]), p = pick([1, a, a * a]), q = pick([a * a * a, a * a]); const xs = [p, q].map(v => Math.round(Math.log(v) / Math.log(a))); const ans = Math.max(...xs);
      return { q: `Solve ${a}²ˣ − ${p + q}(${a}ˣ) + ${p * q} = 0. Give the larger value of x.`, ans, dp: 0, sol: `Let y = ${a}ˣ: y² − ${p + q}y + ${p * q} = 0, so (y − ${p})(y − ${q}) = 0. ${a}ˣ = ${p} gives x = ${xs[0]}; ${a}ˣ = ${q} gives x = ${xs[1]}. Larger: ${ans}.` }; },
    () => { const b = pick([2, 3]), n = pick([1, 2]), k = R(1, 4); const c = k * (Math.pow(b, n) - 1); const ans = k;
      return { q: `Solve log${b === 2 ? '₂' : '₃'}(x + ${c}) − log${b === 2 ? '₂' : '₃'} x = ${n}.`, ans, dp: 2, sol: `log((x + ${c})/x) = ${n}, so (x + ${c})/x = ${Math.pow(b, n)}, x + ${c} = ${Math.pow(b, n)}x, x = ${c}/${Math.pow(b, n) - 1} = ${ans}.` }; },
    () => { const k = pick([0.02, 0.05, 0.08, 0.1, 0.15, 0.2]); const ans = Math.log(2) / k;
      return { q: `A substance decays according to m = m₀e^(−${k}t). Find its half-life (the value of t when m = m₀/2), to 2 d.p.`, ans, dp: 2, sol: `½ = e^(−${k}t), so −${k}t = ln ½, t = ln 2 / ${k} = ${fmt(ans, 4)}.` }; },
    () => { const a = pick([2, 3, 5, 7]), b = R(10, 200); const ans = Math.log(b) / Math.log(a);
      return { q: `Solve ${a}ˣ = ${b}, giving x to 3 d.p.`, ans, dp: 3, sol: `x = ln ${b} / ln ${a} = ${fmt(ans, 5)}.` }; },
    () => { const k = pick([0.2, 0.5, 2, 3]), c = R(3, 40); const ans = Math.log(c) / k;
      return { q: `Solve e^(${k}x) = ${c}, giving x to 3 d.p.`, ans, dp: 3, sol: `${k}x = ln ${c}, so x = ln ${c} / ${k} = ${fmt(ans, 5)}.` }; },
    () => { const A = R(2, 9) * 100, k = pick([0.05, 0.1, 0.2, 0.3]), t = R(2, 10); const ans = A * Math.exp(-k * t);
      return { q: `A quantity decays according to N = ${A}e^(−${k}t). Find N when t = ${t}, to 1 d.p.`, ans, dp: 1, sol: `N = ${A}e^(−${fmt(k * t, 3)}) = ${fmt(ans, 3)}.` }; },
    () => { const p = R(2, 9), q = R(2, 9); const ans = Math.log10(p * q * q);
      return { q: `Given log₁₀ ${p} + 2 log₁₀ ${q} = log₁₀ N, find log₁₀ N to 3 d.p.`, ans, dp: 3, sol: `log ${p} + log ${q}² = log(${p} × ${q * q}) = log ${p * q * q} = ${fmt(ans, 4)}.` }; },
  ],
  'm-trig': [
    () => { const r = R(3, 15), th = pick([0.4, 0.6, 0.8, 1.2, 1.5, 2]); const ans = r * th;
      return { q: `A sector has radius ${r} cm and angle ${th} radians. Find the arc length in cm.`, ans, dp: 2, sol: `s = rθ = ${r} × ${th} = ${fmt(ans, 3)} cm.` }; },
    () => { const r = R(3, 15), th = pick([0.4, 0.6, 0.8, 1.2, 1.5, 2]); const ans = 0.5 * r * r * th;
      return { q: `A sector has radius ${r} cm and angle ${th} radians. Find its area in cm² (2 d.p. if needed).`, ans, dp: 2, sol: `A = ½r²θ = 0.5 × ${r * r} × ${th} = ${fmt(ans, 3)} cm².` }; },
    () => { const k = pick([0.2, 0.3, 0.45, 0.6, 0.7, 0.85]); const p = Math.asin(k) * 180 / Math.PI; const ans = 180 - p;
      return { q: `Solve sin x = ${k} for 0° ≤ x < 360°. Enter the larger solution, to 1 d.p.`, ans, dp: 1, sol: `Principal value x = arcsin ${k} = ${fmt(p, 2)}°. Second solution 180° − ${fmt(p, 2)}° = ${fmt(ans, 2)}°.` }; },
    () => { const b = R(4, 12), c = R(4, 12), A = R(30, 120); const ans = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A * Math.PI / 180));
      return { q: `In triangle ABC, AB = ${c} cm, AC = ${b} cm and angle BAC = ${A}°. Find BC to 3 s.f. (give 2 d.p.).`, ans, dp: 2, sol: `a² = ${b}² + ${c}² − 2(${b})(${c})cos ${A}° = ${fmt(ans * ans, 3)}, so a = ${fmt(ans, 3)} cm.` }; },
    () => { const a = R(1, 8), b = R(1, 8); const ans = Math.sqrt(a * a + b * b);
      return { q: `Write ${a} cos θ + ${b} sin θ in the form R cos(θ − α). Find R to 3 d.p.`, ans, dp: 3, sol: `R = √(${a}² + ${b}²) = √${a * a + b * b} = ${fmt(ans, 4)}.` }; },
  ],
  'm-coord': [
    () => { const a = R(-6, 6), b = R(-6, 6), r = R(2, 9); const D = -2 * a, E = -2 * b, F = a * a + b * b - r * r;
      return { q: `Find the radius of the circle x² + y²${D ? sgn(D) + 'x' : ''}${E ? sgn(E) + 'y' : ''}${F ? sgn(F) : ''} = 0.`, ans: r, dp: 0, sol: `Complete the square: (x ${sgn(-a)})² + (y ${sgn(-b)})² = ${a * a + b * b - F} = ${r}², so r = ${r}.` }; },
    () => { const x1 = R(-6, 6), y1 = R(-6, 6), x2 = R(-6, 6), y2 = R(-6, 6); const ans = Math.hypot(x2 - x1, y2 - y1);
      return { q: `Find the distance between (${x1}, ${y1}) and (${x2}, ${y2}) to 3 d.p.`, ans, dp: 3, sol: `d = √((${x2 - x1})² + (${y2 - y1})²) = √${(x2 - x1) ** 2 + (y2 - y1) ** 2} = ${fmt(ans, 4)}.` }; },
    () => { const m = pick([2, 3, 4, -2, -3, 0.5, -0.5, 1.5]); const ans = -1 / m;
      return { q: `A line has gradient ${m}. What is the gradient of a line perpendicular to it? (2 d.p. if needed)`, ans, dp: 2, sol: `m₁ × m₂ = −1, so m₂ = −1/${m} = ${fmt(ans, 4)}.` }; },
  ],
  'm-num': [
    () => { const p = R(1, 6), q = R(2, 9), x0 = R(2, 3); const f = x0 ** 3 - p * x0 - q, fd = 3 * x0 * x0 - p; const ans = x0 - f / fd;
      return { q: `f(x) = x³ − ${p}x − ${q}. Using x₀ = ${x0}, apply Newton-Raphson once. Give x₁ to 3 d.p.`, ans, dp: 3, sol: `f(${x0}) = ${f}, f'(x) = 3x² − ${p}, f'(${x0}) = ${fd}. x₁ = ${x0} − (${f})/${fd} = ${fmt(ans, 4)}.` }; },
    () => { const c = R(2, 12), x0 = R(1, 3); const g = (x) => Math.cbrt(c + x); const x1 = g(x0), x2 = g(x1);
      return { q: `Using xₙ₊₁ = ∛(${c} + xₙ) with x₀ = ${x0}, find x₂ to 3 d.p.`, ans: x2, dp: 3, sol: `x₁ = ∛${c + x0} = ${fmt(x1, 5)}; x₂ = ∛(${c} + ${fmt(x1, 5)}) = ${fmt(x2, 5)}.` }; },
  ],
  'm-vec': [
    () => { const a = R(-6, 6), b = R(-6, 6), c = R(-6, 6); const ans = Math.sqrt(a * a + b * b + c * c);
      return { q: `Find the magnitude of ${a}i ${b < 0 ? '−' : '+'} ${Math.abs(b)}j ${c < 0 ? '−' : '+'} ${Math.abs(c)}k to 3 d.p.`, ans, dp: 3, sol: `|v| = √(${a * a} + ${b * b} + ${c * c}) = √${a * a + b * b + c * c} = ${fmt(ans, 4)}.` }; },
    () => { const A = [R(-5, 5), R(-5, 5), R(-5, 5)], B = [R(-5, 5), R(-5, 5), R(-5, 5)]; const d = B.map((v, i) => v - A[i]); const ans = Math.hypot(...d);
      return { q: `A has position vector (${A.join(', ')}) and B has position vector (${B.join(', ')}). Find |AB| to 3 d.p.`, ans, dp: 3, sol: `AB = b − a = (${d.join(', ')}), |AB| = ${fmt(ans, 4)}.` }; },
  ],
  'm-data': [
    () => { const n = R(10, 30); const xs = Array.from({ length: n }, () => R(10, 40)); const sx = xs.reduce((a, b) => a + b, 0), sxx = xs.reduce((a, b) => a + b * b, 0); const mean = sx / n; const ans = Math.sqrt(sxx / n - mean * mean);
      return { q: `For n = ${n} values, Σx = ${sx} and Σx² = ${sxx}. Find the standard deviation to 3 d.p.`, ans, dp: 3, sol: `Mean = ${sx}/${n} = ${fmt(mean, 4)}. Variance = ${sxx}/${n} − ${fmt(mean, 4)}² = ${fmt(ans * ans, 4)}. σ = ${fmt(ans, 4)}.` }; },
    () => { const f = R(6, 40), w = pick([2, 4, 5, 10, 20]); const ans = f / w;
      return { q: `A class from ${w * 2} to ${w * 3} has frequency ${f}. Find its frequency density (2 d.p. if needed).`, ans, dp: 2, sol: `Frequency density = frequency ÷ class width = ${f} ÷ ${w} = ${fmt(ans, 3)}.` }; },
    () => { const q1 = R(10, 30), iqr = R(4, 16); const q3 = q1 + iqr; const ans = q3 + 1.5 * iqr;
      return { q: `Q₁ = ${q1} and Q₃ = ${q3}. Using outliers > Q₃ + 1.5 × IQR, find the upper outlier boundary.`, ans, dp: 1, sol: `IQR = ${iqr}. Boundary = ${q3} + 1.5 × ${iqr} = ${ans}.` }; },
  ],
  'm-prob': [
    () => { const a = R(2, 5) / 10, b = R(2, 5) / 10, i = R(0, Math.round(Math.min(a, b) * 10) - 1) / 10; const u = +(a + b - i).toFixed(2);
      return { q: `P(A) = ${a}, P(B) = ${b} and P(A ∪ B) = ${u}. Find P(A ∩ B).`, ans: i, dp: 2, sol: `P(A ∩ B) = P(A) + P(B) − P(A ∪ B) = ${a} + ${b} − ${u} = ${i}.` }; },
    () => { const b = R(3, 8) / 10, i = R(1, 2) / 10; const ans = i / b;
      return { q: `P(B) = ${b} and P(A ∩ B) = ${i}. Find P(A | B) to 3 d.p.`, ans, dp: 3, sol: `P(A | B) = P(A ∩ B)/P(B) = ${i}/${b} = ${fmt(ans, 4)}.` }; },
    () => { const a = R(1, 8) / 10, b = R(1, 8) / 10; const ans = a * b;
      return { q: `A and B are independent with P(A) = ${a} and P(B) = ${b}. Find P(A ∩ B).`, ans, dp: 2, sol: `Independent, so P(A ∩ B) = ${a} × ${b} = ${fmt(ans, 3)}.` }; },
  ],
  'm-dist': [
    () => { const n = R(6, 15), p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), r = R(1, Math.min(5, n)); const ans = comb(n, r) * p ** r * (1 - p) ** (n - r);
      return { q: `X ~ B(${n}, ${p}). Find P(X = ${r}) to 4 d.p.`, ans, dp: 4, sol: `P(X = ${r}) = ${n}C${r} × ${p}^${r} × ${fmt(1 - p, 2)}^${n - r} = ${fmt(ans, 5)}.` }; },
    () => { const mu = R(20, 80), s = R(2, 10), x = mu + R(-2 * s, 2 * s); const z = (x - mu) / s; const ans = Phi(z);
      return { q: `X ~ N(${mu}, ${s}²). Find P(X < ${x}) to 4 d.p.`, ans, dp: 4, sol: `z = (${x} − ${mu})/${s} = ${fmt(z, 4)}. P(Z < ${fmt(z, 3)}) = ${fmt(ans, 5)}.` }; },
    () => { const n = R(8, 20), p = pick([0.2, 0.3, 0.4, 0.5]); const ans = n * p * (1 - p);
      return { q: `X ~ B(${n}, ${p}). Find the variance of X.`, ans, dp: 2, sol: `Var(X) = np(1 − p) = ${n} × ${p} × ${fmt(1 - p, 2)} = ${fmt(ans, 3)}.` }; },
  ],
  'm-hyp': [
    () => { const n = R(10, 20), p = pick([0.2, 0.25, 0.3, 0.4, 0.5]); const k = Math.min(n, Math.round(n * p) + R(2, 4)); let ans = 0; for (let i = k; i <= n; i++) ans += comb(n, i) * p ** i * (1 - p) ** (n - i);
      return { q: `Under H₀, X ~ B(${n}, ${p}). The observed value is x = ${k}. Find P(X ≥ ${k}) to 4 d.p. (the p-value for H₁: p > ${p}).`, ans, dp: 4, sol: `P(X ≥ ${k}) = 1 − P(X ≤ ${k - 1}) = ${fmt(ans, 5)}. Compare with the significance level: ${ans < 0.05 ? 'below 5%, so reject H₀ at 5%' : 'above 5%, so do not reject H₀ at 5%'}.` }; },
    () => { const mu = R(40, 60), s = R(4, 10), n = pick([16, 25, 36]), xbar = +(mu + R(1, 4) * 0.5).toFixed(1); const z = (xbar - mu) / (s / Math.sqrt(n)); const ans = 1 - Phi(z);
      return { q: `X ~ N(${mu}, ${s}²). A sample of ${n} has mean ${xbar}. Find P(X̄ ≥ ${xbar}) to 4 d.p.`, ans, dp: 4, sol: `X̄ ~ N(${mu}, ${s}²/${n}), so SE = ${fmt(s / Math.sqrt(n), 4)}. z = ${fmt(z, 4)}. P(Z ≥ z) = ${fmt(ans, 5)}.` }; },
  ],
  'm-kin': [
    () => { const H = pick([10, 20, 30, 40, 45, 60]), u = R(5, 20); const t = Math.sqrt(2 * H / G), ans = u * t;
      return { q: `A ball is projected horizontally at ${u} m s⁻¹ from the top of a cliff ${H} m high. Find the horizontal distance it travels before hitting the ground, in m to 1 d.p. (g = 9.8).`, ans, dp: 1, sol: `Vertical: ${H} = 4.9t², so t = √(${H}/4.9) = ${fmt(t, 4)} s. Horizontal: ${u} × ${fmt(t, 4)} = ${fmt(ans, 3)} m.` }; },
    () => { const u = R(12, 30), th = pick([25, 30, 35, 40, 50, 60]); const r = th * Math.PI / 180; const ans = Math.pow(u * Math.sin(r), 2) / (2 * G);
      return { q: `A projectile is launched from ground level at ${u} m s⁻¹ at ${th}° above the horizontal. Find its greatest height in m to 2 d.p. (g = 9.8).`, ans, dp: 2, sol: `Vertical component ${u} sin ${th}° = ${fmt(u * Math.sin(r), 4)}. At the top v = 0: 0 = (${fmt(u * Math.sin(r), 4)})² − 19.6h, so h = ${fmt(ans, 4)} m.` }; },
    () => { const u = R(15, 30), th = pick([30, 40, 45, 50, 60]), t = pick([0.5, 1, 1.5, 2]); const r = th * Math.PI / 180; const vx = u * Math.cos(r), vy = u * Math.sin(r) - G * t; const ans = Math.hypot(vx, vy);
      return { q: `A particle is projected at ${u} m s⁻¹ at ${th}° above the horizontal. Find its speed ${t} s later, in m s⁻¹ to 2 d.p. (g = 9.8).`, ans, dp: 2, sol: `Horizontal: ${fmt(vx, 4)}. Vertical: ${u} sin ${th}° − 9.8(${t}) = ${fmt(vy, 4)}. Speed = √(${fmt(vx, 3)}² + ${fmt(vy, 3)}²) = ${fmt(ans, 4)} m s⁻¹.` }; },
    () => { const H = pick([10, 15, 20, 25, 30]), u = R(8, 20), th = pick([20, 30, 40]); const r = th * Math.PI / 180; const vy = u * Math.sin(r); const ans = (vy + Math.sqrt(vy * vy + 2 * G * H)) / G;
      return { q: `A stone is thrown from a point ${H} m above the ground at ${u} m s⁻¹, ${th}° above the horizontal. Find the time until it hits the ground, in s to 2 d.p. (g = 9.8).`, ans, dp: 2, sol: `Taking up as positive: −${H} = ${fmt(vy, 4)}t − 4.9t², so 4.9t² − ${fmt(vy, 4)}t − ${H} = 0. Positive root: t = ${fmt(ans, 4)} s.` }; },
    () => { const u = R(0, 12), a = R(1, 6), t = R(2, 9); const ans = u * t + 0.5 * a * t * t;
      return { q: `A particle starts with speed ${u} m s⁻¹ and accelerates at ${a} m s⁻² for ${t} s. Find the distance travelled in m.`, ans, dp: 1, sol: `s = ut + ½at² = ${u}(${t}) + 0.5(${a})(${t * t}) = ${ans} m.` }; },
    () => { const u = R(2, 15), a = R(1, 5), s = R(5, 40); const ans = Math.sqrt(u * u + 2 * a * s);
      return { q: `A car moving at ${u} m s⁻¹ accelerates uniformly at ${a} m s⁻² over ${s} m. Find its final speed in m s⁻¹ to 2 d.p.`, ans, dp: 2, sol: `v² = u² + 2as = ${u * u} + ${2 * a * s} = ${u * u + 2 * a * s}, v = ${fmt(ans, 3)} m s⁻¹.` }; },
    () => { const u = R(10, 30), th = pick([20, 30, 40, 45, 50, 60]); const ans = 2 * u * Math.sin(th * Math.PI / 180) / G;
      return { q: `A projectile is launched from the ground at ${u} m s⁻¹ at ${th}° above the horizontal. Find the time of flight in s to 2 d.p. (g = 9.8).`, ans, dp: 2, sol: `Vertical: 0 = ${u} sin ${th}° t − 4.9t², so t = 2 × ${u} sin ${th}°/9.8 = ${fmt(ans, 3)} s.` }; },
    () => { const u = R(5, 25); const ans = u * u / (2 * G);
      return { q: `A ball is thrown vertically upwards at ${u} m s⁻¹. Find its maximum height in m to 2 d.p. (g = 9.8).`, ans, dp: 2, sol: `At the top v = 0: 0 = ${u}² − 2(9.8)s, so s = ${u * u}/19.6 = ${fmt(ans, 3)} m.` }; },
  ],
  'm-force': [
    () => { const m = R(2, 12), P = R(20, 80), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4]); const Fr = mu * m * G; const ans = (P - Fr) / m;
      if (ans <= 0) return GEN['m-force'][1]();
      return { q: `A box of mass ${m} kg is pulled along rough horizontal ground by a horizontal force of ${P} N. μ = ${mu}. Find the acceleration in m s⁻² to 2 d.p. (g = 9.8).`, ans, dp: 2, sol: `R = ${m}g = ${fmt(m * G, 2)} N. F = μR = ${fmt(Fr, 3)} N. ${P} − ${fmt(Fr, 3)} = ${m}a, a = ${fmt(ans, 3)} m s⁻².` }; },
    () => { const th = pick([10, 15, 20, 25, 30, 35]); const ans = G * Math.sin(th * Math.PI / 180);
      return { q: `A particle slides down a smooth slope inclined at ${th}° to the horizontal. Find its acceleration in m s⁻² to 2 d.p. (g = 9.8).`, ans, dp: 2, sol: `Resolving down the slope: mg sin ${th}° = ma, so a = 9.8 sin ${th}° = ${fmt(ans, 3)} m s⁻².` }; },
    () => { const m1 = R(2, 8), m2 = m1 + R(1, 6); const a = (m2 - m1) * G / (m1 + m2); const T = m1 * (G + a);
      return { q: `Particles of mass ${m1} kg and ${m2} kg hang either side of a smooth pulley on a light inextensible string. Find the tension in the string in N to 2 d.p. (g = 9.8).`, ans: T, dp: 2, sol: `a = (${m2} − ${m1})g/(${m1 + m2}) = ${fmt(a, 4)}. For the ${m1} kg mass: T − ${m1}g = ${m1}a, so T = ${fmt(T, 3)} N.` }; },
  ],
  'm-mom': [
    () => { const L = R(4, 10), W = R(10, 60), d = R(1, L - 1); const RB = W * d / L; const RA = W - RB;
      return { q: `A light rod of length ${L} m rests on supports at each end, A and B. A weight of ${W} N is placed ${d} m from A. Find the reaction at A in N (2 d.p. if needed).`, ans: RA, dp: 2, sol: `Moments about B: R_A × ${L} = ${W} × ${L - d}, so R_A = ${fmt(RA, 3)} N.` }; },
    () => { const L = R(4, 10), m = R(5, 30), x = R(1, L - 1), M = R(10, 50); const ans = (m * G * L / 2 + M * G * x) / L;
      return { q: `A uniform beam of length ${L} m and mass ${m} kg rests on supports at its ends A and B. A load of ${M} kg is placed ${x} m from A. Find the reaction at B in N to 1 d.p. (g = 9.8).`, ans, dp: 1, sol: `Moments about A: R_B × ${L} = ${m}g × ${L / 2} + ${M}g × ${x}, R_B = ${fmt(ans, 3)} N.` }; },
  ],
  'm-samp': [
    () => { const n = pick([20, 25, 30, 40, 50]), N = n * pick([15, 20, 24, 30, 40]); const ans = N / n;
      return { q: `A systematic sample of ${n} is taken from a population of ${N}. What is the sampling interval k?`, ans, dp: 0, sol: `k = population ÷ sample size = ${N} ÷ ${n} = ${ans}.` }; },
    () => { const g1 = R(100, 400), g2 = R(100, 400), n = pick([30, 40, 50]); const ans = Math.round(g1 / (g1 + g2) * n);
      return { q: `A school has ${g1} pupils in Year 12 and ${g2} in Year 13. A stratified sample of ${n} is taken. How many Year 12 pupils should be chosen (nearest whole number)?`, ans, dp: 0, sol: `${g1}/(${g1} + ${g2}) × ${n} = ${fmt(g1 / (g1 + g2) * n, 3)} ≈ ${ans}.` }; },
  ],
  'm-alg': [
    () => { const a = nz(-3, 4), b = R(-9, 9), c = R(-9, 9); const ans = b * b - 4 * a * c;
      return { q: `Find the discriminant of ${poly([[a, 'x²'], [b, 'x'], [c, '']])}.`, ans, dp: 0, sol: `b² − 4ac = ${b * b} − 4(${a})(${c}) = ${ans}. ${ans > 0 ? 'Two distinct real roots.' : ans === 0 ? 'One repeated root.' : 'No real roots.'}` }; },
    () => { const p = R(-5, 5), q = R(-5, 5), r = R(-4, 4); const b = -(p + q + r), c = p * q + q * r + p * r, d = -p * q * r; const k = nz(-4, 4); const ans = k ** 3 + b * k * k + c * k + d;
      return { q: `f(x) = ${poly([[1, 'x³'], [b, 'x²'], [c, 'x'], [d, '']])}. Use the remainder theorem to find the remainder when f(x) is divided by (x ${k < 0 ? '+' : '−'} ${Math.abs(k)}).`, ans, dp: 0, sol: `Remainder = f(${k}) = ${ans}.` }; },
    () => { const a = R(2, 9), b = R(2, 4); const ans = Math.pow(a, b);
      return { q: `Evaluate ${a * a}^(${b}/2).`, ans, dp: 0, sol: `${a * a}^(${b}/2) = (√${a * a})^${b} = ${a}^${b} = ${ans}.` }; },
  ],
  'm-proof': [],
};
