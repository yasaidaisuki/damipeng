/**
 * Clean route path for a page URL. build.format is 'file', so pathnames end in .html at build
 * time ("/work.html", "/index.html"); this returns "/work" and "/".
 */
export function cleanPath(pathname: string): string {
  return pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
}
