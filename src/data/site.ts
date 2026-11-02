// Site-wide copy, links and page text, following the design handoff mockups. Components render
// from this; don't hardcode copy in them.

const GITHUB_URL = 'https://github.com/yasaidaisuki';
const LINKEDIN_URL = 'https://www.linkedin.com/in/dami-peng';

export const site = {
  name: 'Dami Peng',
  /** Wordmark in the nav. */
  handle: 'dami.peng',
  title: 'Dami Peng · Software Engineer',
  description:
    'Dami Peng is a software engineer working on backend systems and infrastructure. Computational Math at the University of Waterloo, graduating Aug 2027.',
  locale: 'en_CA',
  email: 'peng.dingkai@gmail.com',
  github: GITHUB_URL,
  linkedin: LINKEDIN_URL,
  resume: '/resume.pdf',
  status: 'Open to new grad SWE roles · graduating Aug 2027',
  /** Left side of the footer. */
  meta: 'Toronto · Canadian citizen · TN eligible',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'Contact', href: '/contact' },
];

export interface LinkItem {
  label: string;
  href: string;
  /** Visible value on the contact page, e.g. the email address. */
  value: string;
  /** Decorative glyph after the value. */
  suffix?: '↗' | '↓';
  external?: boolean;
}

export const links: Record<'email' | 'github' | 'linkedin' | 'resume', LinkItem> = {
  email: { label: 'Email', href: `mailto:${site.email}`, value: site.email },
  linkedin: {
    label: 'LinkedIn',
    href: site.linkedin,
    value: site.linkedin.replace('https://www.', ''),
    suffix: '↗',
    external: true,
  },
  github: {
    label: 'GitHub',
    href: site.github,
    value: site.github.replace('https://', ''),
    suffix: '↗',
    external: true,
  },
  resume: { label: 'Résumé', href: site.resume, value: 'PDF', suffix: '↓', external: true },
};

export interface NowNextItem {
  label: string;
  /** Rendered as: {before}<strong>{org}</strong>{after} */
  before: string;
  org: string;
  after: string;
}

export interface ImpactMetric {
  value: string;
  detail: string;
}

export interface Project {
  name: string;
  href?: string;
  stack: string[];
  summary: string;
}

export const home = {
  pitch:
    'Software engineer working on backend systems and infrastructure — the queues, workers and deploys that keep products fast and boring in production.',
  ctas: {
    work: 'See my work',
    resume: 'Résumé (PDF)',
  },
  nowNext: [
    {
      label: 'Now',
      before: 'SWE intern at ',
      org: 'IBM Skills Network',
      after:
        ', third term — Kubernetes, Redis and Terraform on a platform serving 80K monthly users.',
    },
    {
      label: 'Next',
      before: 'SWE intern at ',
      org: 'Shopify',
      after: ', Winter 2027. Computational Math at the University of Waterloo.',
    },
  ] satisfies NowNextItem[],
  sections: {
    about: 'About',
    impact: 'Selected impact',
    projects: 'Project',
    writing: 'Writing',
  },
  about: [
    'I like problems where the fix is structural: moving uploads off the server and straight to S3, splitting workers from the API so one can fail without taking the other down, making a lost event impossible instead of rare.',
    'Before backend, I spent a term on optimization research — benchmarking accelerated gradient methods on CIFAR-10 — and I still reach for measurement before opinion. On the side I built a C compiler with Flex, Bison and LLVM, mostly to see how the layers I depend on actually work.',
    'I write here about the systems I build and what broke along the way.',
  ],
  impact: [
    { value: '−99%', detail: 'Redis memory, by moving uploads to direct-to-S3 pre-signed URLs' },
    { value: '−71%', detail: 'Latency after migrating LLM/STT models, with zero eval regressions' },
    { value: '83%', detail: 'of users stopped losing WebSocket events via Redis Pub/Sub fan-out' },
  ] satisfies ImpactMetric[],
  impactLink: 'Full work history →',
  writingAll: 'All posts →',
  writingEmpty: 'Posts are on the way.',
};

export const projects: Project[] = [
  {
    name: 'C Compiler',
    // TODO: point at the repo once it's public.
    href: GITHUB_URL,
    stack: ['C++', 'Flex', 'Bison', 'LLVM'],
    summary:
      'End-to-end compiler with a two-pass design — symbol collection, then semantic analysis and LLVM IR codegen — over a type-safe AST built on std::variant.',
  },
];

export const pages = {
  work: {
    title: 'Work',
    description: 'Experience at Shopify, IBM, the University of Waterloo and Civiconnect.',
    heading: 'Work',
    intro:
      'Five internships across startups, research and big tech. Mostly backend, infra and the occasional frontend rebuild.',
    resumeLink: 'Download résumé (PDF) →',
    incoming: 'Incoming',
    terms: (n: number) => `${n} terms`,
  },
  writing: {
    title: 'Writing',
    description:
      'Notes on systems I have built, bugs I have chased, and the trade-offs behind them.',
    heading: 'Writing',
    // Phase 2: append "Every post has a discussion thread — sign in with GitHub to join."
    intro: 'Notes on systems I have built, bugs I have chased, and the trade-offs behind them.',
    filterLabel: 'Filter by topic',
    allTopics: 'All',
    empty: 'No posts yet.',
    backLink: '← All writing',
    readingTime: (minutes: number) => `${minutes} min read`,
    comments: (n: number) => `${n} ${n === 1 ? 'comment' : 'comments'}`,
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Dami Peng about new grad software engineering roles.',
    heading: 'Get in touch',
    intro:
      "I'm looking for new grad software engineering roles starting after I graduate in August 2027 — in Canada or the US. Canadian citizen, TN visa eligible.",
    note: 'Based in Toronto · usually replies within a couple of days',
  },
  notFound: {
    title: 'Not found',
    description: "This page doesn't exist.",
    heading: 'Page not found',
    body: "The page you're looking for doesn't exist or has moved.",
    back: '← Back home',
  },
  comments: {
    heading: 'Discussion',
    placeholder: 'Comments are coming soon.',
  },
  footer: {
    rss: 'RSS',
  },
  skipLink: 'Skip to content',
};
