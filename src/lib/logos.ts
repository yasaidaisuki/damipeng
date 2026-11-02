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
  width: number;
  height: number;
  /** Negative margins that collapse built-in padding (see WorkLogo.padding). */
  style?: Record<string, string> | undefined;
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

const px = (n: number) => `${-Math.round(n)}px`;

/**
 * Resolves a logo at build time. Returns undefined if the file is missing under public/, so callers
 * can fall back to a text wordmark. Width/height are set to avoid layout shift.
 */
export function resolveLogo(logo: WorkLogo | undefined): ResolvedLogo | undefined {
  if (!logo || !existsSync(publicPath(logo.src))) return undefined;
  const height = Math.round(CAP_HEIGHT / logo.capHeight);
  const width = Math.round(height * aspectRatio(publicPath(logo.src)));
  const pad = logo.padding;
  const style = pad && {
    marginTop: px(pad.top * height),
    marginRight: px(pad.right * width),
    marginBottom: px(pad.bottom * height),
    marginLeft: px(pad.left * width),
  };
  return { src: logo.src, width, height, style };
}
