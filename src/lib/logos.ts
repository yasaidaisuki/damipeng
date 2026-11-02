import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { WorkLogo } from '@/data/work';

/** Rendered logo height in px; width follows the SVG's aspect ratio. */
const LOGO_HEIGHT = 40;

export interface ResolvedLogo {
  src: string;
  darkSrc?: string | undefined;
  width: number;
  height: number;
}

const publicPath = (src: string) => join(process.cwd(), 'public', src);

/** Aspect ratio (w/h) from the SVG's viewBox, falling back to its width/height attributes. */
function aspectRatio(file: string): number {
  const svg = readFileSync(file, 'utf8');
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

/**
 * Resolves a logo at build time. Returns undefined if the file is missing under public/, so callers
 * can fall back to a text wordmark. Width/height are set to avoid layout shift.
 */
export function resolveLogo(logo: WorkLogo | undefined): ResolvedLogo | undefined {
  if (!logo || !existsSync(publicPath(logo.src))) return undefined;
  const darkSrc = logo.darkSrc && existsSync(publicPath(logo.darkSrc)) ? logo.darkSrc : undefined;
  return {
    src: logo.src,
    darkSrc,
    width: Math.round(LOGO_HEIGHT * aspectRatio(publicPath(logo.src))),
    height: LOGO_HEIGHT,
  };
}
