import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Returns the logo path if the file exists under public/, otherwise undefined so callers can
 * fall back to a text wordmark. Runs at build time only.
 */
export function resolveLogo(logo: string | undefined): string | undefined {
  if (!logo) return undefined;
  return existsSync(join(process.cwd(), 'public', logo)) ? logo : undefined;
}
