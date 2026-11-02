// Checks WCAG contrast for the design tokens in src/styles/global.css. Run: node scripts/contrast.mjs
const lum = (hex) => {
  const c = hex
    .replace('#', '')
    .match(/../g)
    .map((h) => parseInt(h, 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const themes = {
  light: {
    bg: '#FFFFFF',
    surface: '#F7F7F9',
    fg: '#111113',
    body: '#26262C',
    muted: '#5B5B66',
    hairline: '#E6E6EA',
    accent: '#2347C6',
    onAccent: '#FFFFFF',
  },
  dark: {
    bg: '#0D0D10',
    surface: '#151519',
    fg: '#EDEDF0',
    body: '#C8C8D0',
    muted: '#9C9CA8',
    hairline: '#2A2A31',
    accent: '#7D97F2',
    onAccent: '#0D0D10',
  },
};

let failed = false;
for (const [name, t] of Object.entries(themes)) {
  const checks = [
    ['fg/bg', t.fg, t.bg, 4.5],
    ['body/bg', t.body, t.bg, 4.5],
    ['muted/bg', t.muted, t.bg, 4.5],
    ['muted/surface', t.muted, t.surface, 4.5],
    ['accent/bg', t.accent, t.bg, 4.5],
    ['accent/surface', t.accent, t.surface, 4.5],
    ['onAccent/accent', t.onAccent, t.accent, 4.5],
  ];
  for (const [label, a, b, min] of checks) {
    const r = ratio(a, b);
    if (r < min) failed = true;
    console.log(
      `${name.padEnd(5)} ${label.padEnd(16)} ${r.toFixed(2).padStart(5)}:1 ${r >= min ? 'ok' : 'FAIL'}`,
    );
  }
}
process.exit(failed ? 1 : 0);
