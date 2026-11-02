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
    surface: '#F6F6F8',
    chip: '#F3F3F5',
    fg: '#111113',
    body: '#26262C',
    secondary: '#3A3A42',
    muted: '#5B5B66',
    accent: '#2347C6',
    onAccent: '#FFFFFF',
    inverse: '#111113',
    onInverse: '#FFFFFF',
    brandIbm: '#0F62FE',
    brandShopify: '#008060',
  },
  dark: {
    bg: '#10141C',
    surface: '#161B25',
    chip: '#1A202B',
    fg: '#EDEFF3',
    body: '#CBCFD8',
    secondary: '#B3B8C3',
    muted: '#979DAA',
    accent: '#8CA4F5',
    onAccent: '#10141C',
    inverse: '#EDEFF3',
    onInverse: '#10141C',
    brandIbm: '#78A9FF',
    brandShopify: '#95BF47',
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
    ['secondary/bg', t.secondary, t.bg, 4.5],
    ['secondary/chip', t.secondary, t.chip, 4.5],
    ['onInverse/inverse', t.onInverse, t.inverse, 4.5],
    ['brandIbm/bg', t.brandIbm, t.bg, 4.5],
    ['brandShopify/bg', t.brandShopify, t.bg, 4.5],
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
