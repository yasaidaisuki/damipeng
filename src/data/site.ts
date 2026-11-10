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
    'Dami Peng is a software engineer building backend systems and infrastructure. Computational Mathematics at the University of Waterloo, open to Summer 2027 internships and new grad roles.',
  locale: 'en_CA',
  email: 'peng.dingkai@gmail.com',
  github: GITHUB_URL,
  linkedin: LINKEDIN_URL,
  resume: '/resume.pdf',
  status: 'Open to Summer 2027 SWE internships and new grad roles',
  /** Left side of the footer. */
  meta: 'Toronto · Canadian citizen · TN eligible',
} as const;

/**
 * Post comments run on giscus: each post's thread is a GitHub Discussion in this public repo,
 * titled with the post's slug. The IDs are public; the README shows how to look them up. Until
 * they're filled in, posts show `pages.comments.closed` instead of a thread.
 */
export const giscus = {
  repo: 'yasaidaisuki/blog-comments',
  repoId: '',
  category: 'Comments',
  categoryId: '',
  /** Where the no-JS fallback link goes. */
  discussionsUrl: 'https://github.com/yasaidaisuki/blog-comments/discussions',
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
  /** Company website; the name links here. */
  orgHref: string;
  /** Set the company name in its brand typeface and hover color. */
  orgBrand?: 'ibm' | 'shopify';
}

export interface ImpactMetric {
  value: string;
  detail: string;
}

export interface Project {
  name: string;
  /** Repo URL; the whole card links here. */
  href: string;
  stack: string[];
  summary: string;
  /** Extra links shown on the card (e.g. a paper). */
  links?: { label: string; href: string }[];
}

export const home = {
  pitch: 'Software engineer building backend systems and infrastructure.',
  pitchDetail:
    'I like designing systems that work reliably in production and understanding the engineering decisions behind them.',
  ctas: {
    work: 'See my work',
    resume: 'Résumé (PDF)',
  },
  room: {
    alt: 'Isometric 3D model of my room: desk with a curved monitor, shelves, posters, a bed and a floor lamp',
    hint: '↔ Drag to look around',
    caption: 'My room, modelled in Blender',
  },
  nowNext: [
    {
      label: 'Now',
      before: 'SWE intern at ',
      org: 'IBM Skills Network',
      orgHref: 'https://skills.network/',
      orgBrand: 'ibm',
      after: ', third term — backend infrastructure for a platform serving 80K monthly users.',
    },
    {
      label: 'Next',
      before: 'Engineering intern at ',
      org: 'Shopify',
      orgHref: 'https://www.shopify.com/',
      orgBrand: 'shopify',
      after: ', Winter 2027. Computational Mathematics at the University of Waterloo.',
    },
  ] satisfies NowNextItem[],
  sections: {
    about: 'About',
    impact: 'Impact',
    projects: 'Projects',
    writing: 'Writing',
  },
  about: [
    "I'm drawn to problems where the right fix is structural: separating workers from API servers, getting events reliably across replicas, or making background jobs observable without digging through production pods. I enjoy thinking about system boundaries, failure modes and the tradeoffs behind an architecture. I care less about adding another layer of abstraction and more about making the underlying system work well.",
    "At the same time, I like understanding how things work beneath those abstractions. Outside of work, I spend a lot of time building projects in C++. I've built a C compiler with Flex, Bison and LLVM, and enjoy exploring the mechanics behind the tools and systems I use. I also spent a term on optimization research, benchmarking accelerated gradient methods on CIFAR-10 — an experience that reinforced my preference for measurement over intuition.",
    'I write here about the systems I build, the engineering decisions behind them, what breaks, and the things I learn along the way.',
  ],
  impact: [
    { value: '−99%', detail: 'Redis memory, by moving uploads to direct-to-S3 pre-signed URLs' },
    {
      value: '80K',
      detail: 'monthly users on a React/TypeScript SPA re-architected from a 20K-LOC legacy app',
    },
    {
      value: '$17K/yr',
      detail:
        'saved in infra and API costs: Kubernetes worker isolation plus an LLM/STT model migration',
    },
  ] satisfies ImpactMetric[],
  impactLink: 'Full work history →',
  writingAll: 'All posts →',
  writingEmpty: 'Posts are on the way.',
};

const repo = (name: string) => `${GITHUB_URL}/${name}`;

export const projects: Project[] = [
  {
    name: 'C Compiler',
    href: repo('c_compiler'),
    stack: ['C++', 'Flex', 'Bison', 'LLVM'],
    summary:
      'End-to-end compiler with a two-pass design — symbol collection, then semantic analysis and LLVM IR codegen — over a type-safe AST built on std::variant.',
  },
  {
    name: 'Parametric Modelling',
    href: repo('ParametricModelling'),
    stack: ['C++', 'Maya API', 'CMake'],
    summary:
      'A Maya plug-in with custom dependency-graph nodes that generate procedural staircase and arched-bridge meshes in real time, with Perlin-noise surface weathering.',
  },
  {
    name: 'Chess',
    href: repo('Chess'),
    stack: ['C++', 'X11'],
    summary:
      'Chess engine with standard and atomic variants, three computer difficulty levels and thread-safe move calculation. A differential renderer cut move redraws from 3.5s to 0.1s.',
  },
  {
    name: 'Portfolio Optimization',
    href: repo('portoflio_optimization'),
    stack: ['Python', 'Gurobi', 'Linear programming'],
    summary:
      "A robust linear program for portfolio selection that adapts Soyster's and Bertsimas–Sim models to worst-case volatility. Team paper for CO 370, Deterministic OR Models.",
    links: [
      { label: 'Paper (PDF)', href: `${repo('portoflio_optimization')}/blob/main/paper.pdf` },
    ],
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
    intro: 'Notes on systems I have built, bugs I have chased, and the trade-offs behind them.',
    /** Appended to the intro once comments are live. */
    commentsNote: 'Every post has a discussion thread — sign in with GitHub to join.',
    filterLabel: 'Filter by topic',
    allTopics: 'All',
    empty: 'No posts yet.',
    backLink: '← All writing',
    readingTime: (minutes: number) => `${minutes} min read`,
    comments: (n: number) => `${n} ${n === 1 ? 'comment' : 'comments'}`,
  },
  contact: {
    title: 'Contact',
    description:
      'Get in touch with Dami Peng about Summer 2027 internships and new grad software engineering roles.',
    heading: 'Get in touch',
    intro:
      "I'm looking for Summer 2027 software engineering internships and new grad roles. My graduation date is flexible, so I can start full-time as early as September 2027 — in Canada or the US. Canadian citizen, TN visa eligible.",
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
    /** Shown without JavaScript, or if giscus is blocked; hidden once the thread loads. */
    fallback: 'Join the discussion on GitHub →',
    /** Before the giscus IDs are set. */
    closed: 'Comments are coming soon.',
    draft: 'Comments open when this post is published.',
  },
  footer: {
    rss: 'RSS',
  },
  skipLink: 'Skip to content',
};
