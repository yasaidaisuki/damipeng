import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { WorkLogo } from '@/data/work';

/**
 * Height in px of each logo's capital letters. Logos are scaled so their lettering matches,
 * rather than their bounding boxes (an all-caps wordmark and an icon + lowercase one differ a lot).
 */
const CAP_HEIGHT = 24;

export interface ResolvedLogo {
  src: string;
  /** Intrinsic render size of the whole file (incl. any built-in padding), for width/height attrs. */
  width: number;
  height: number;
  /** Width of the visible artwork in px; the wrapper is this wide but never wider than its column. */
  boxWidth: number;
  /**
   * Image sizing as percentages of the wrapper's width, so the logo scales down on narrow screens.
   * Percent margins (vertical ones included) resolve against the wrapper's width, which lets the
   * negative margins collapse built-in padding at any size; the wrapper clips what's left.
   */
  imgStyle: Record<string, string>;
}

const publicPath = (src: string) => join(process.cwd(), 'public', src);

/** Aspect ratio (w/h) of an SVG (viewBox, else width/height) or PNG (IHDR header). */
function aspectRatio(file: string): number {
  const buf = readFileSync(file);
  if (file.endsWith('.png')) return buf.readUInt32BE(16) / buf.readUInt32BE(20);
  const svg = buf.toString('utf8');
  const viewBox = svg
    .match(/viewBox="([\d.\s-]+)"/)?.[1]
    ?.trim()
    .split(/\s+/)
    .map(Number);
  if (viewBox?.length === 4 && viewBox[2] && viewBox[3]) return viewBox[2] / viewBox[3];
  const w = Number(svg.match(/\swidth="([\d.]+)/)?.[1]);
  const h = Number(svg.match(/\sheight="([\d.]+)/)?.[1]);
  return w && h ? w / h : 1;
}

const pct = (n: number) => `${+n.toFixed(3)}%`;

/**
 * Resolves a logo at build time. Returns undefined if the file is missing under public/, so callers
 * can fall back to a text wordmark.
 */
export function resolveLogo(logo: WorkLogo | undefined): ResolvedLogo | undefined {
  if (!logo || !existsSync(publicPath(logo.src))) return undefined;
  const height = Math.round(CAP_HEIGHT / logo.capHeight);
  const width = Math.round(height * aspectRatio(publicPath(logo.src)));
  const pad = logo.padding ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const boxWidth = Math.round(width * (1 - pad.left - pad.right));
  const ofBox = (px: number) => (px / boxWidth) * 100;
  const imgStyle = {
    width: pct(ofBox(width)),
    marginLeft: pct(-ofBox(pad.left * width)),
    marginTop: pct(-ofBox(pad.top * height)),
    marginBottom: pct(-ofBox(pad.bottom * height)),
  };
  return { src: logo.src, width, height, boxWidth, imgStyle };
}
