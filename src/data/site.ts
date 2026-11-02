// Site-wide copy, links and page text. Components render from this; don't hardcode copy in them.

// TODO: replace with your real profile URLs.
const GITHUB_URL = 'https://github.com/TODO';
const LINKEDIN_URL = 'https://www.linkedin.com/in/TODO';

export const site = {
  name: 'Dami Peng',
  title: 'Dami Peng · Software Engineer',
  description:
    'Dami Peng is a Computational Math student at the University of Waterloo building infrastructure, product and realtime AI systems.',
  locale: 'en_CA',
  email: 'peng.dingkai@gmail.com',
  github: GITHUB_URL,
  linkedin: LINKEDIN_URL,
  resume: '/resume.pdf',
  status: 'Open to new grad SWE roles · graduating Aug 2027',
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
  /** Visible value next to the label, e.g. the email address. */
  value?: string;
  external?: boolean;
}

export const links: Record<'email' | 'github' | 'linkedin' | 'resume', LinkItem> = {
  email: { label: 'Email', href: `mailto:${site.email}`, value: site.email },
  github: {
    label: 'GitHub',
    href: site.github,
    value: site.github.replace('https://', ''),
    external: true,
  },
  linkedin: {
    label: 'LinkedIn',
    href: site.linkedin,
    value: site.linkedin.replace('https://www.', ''),
    external: true,
  },
  resume: { label: 'Résumé', href: site.resume, value: 'PDF', external: true },
};

export interface NowNextItem {
  label: string;
  title: string;
  period: string;
  body: string;
}

export interface ImpactMetric {
  value: string;
  label: string;
  detail: string;
}

export interface Project {
  name: string;
  /** TODO: add the repo URL once it's public. */
  href?: string;
  stack: string[];
  summary: string;
  bullets: string[];
}

export const home = {
  pitch:
    'Software engineer working across infrastructure, product and realtime AI. Currently at IBM, joining Shopify in Winter 2027.',
  ctas: {
    work: 'See my work',
  },
  sections: {
    nowNext: 'Now / Next',
    about: 'About',
    impact: 'Selected impact',
    projects: 'Project',
    writing: 'Latest writing',
  },
  nowNext: [
    {
      label: 'Now',
      title: 'IBM · Software Engineer Intern',
      period: 'Sep – Dec 2026',
      body: 'Infrastructure on Skills Network: direct-to-S3 ingestion, isolating workers on Kubernetes, and fanning realtime events out across API replicas.',
    },
    {
      label: 'Next',
      title: 'Shopify · Software Engineer Intern',
      period: 'Winter 2027',
      body: 'Starting in Toronto in January. After that I graduate in August 2027 and am looking for a new grad SWE role.',
    },
  ] satisfies NowNextItem[],
  // TODO: draft copy written from the résumé. Edit to your own voice.
  about: [
    "I'm a Computational Math student at the University of Waterloo, graduating in August 2027. I like the parts of software where correctness and performance meet: infrastructure, compilers, and systems that have to stay fast under real load.",
    "Across three terms on IBM's Skills Network team I've worked up and down the stack, from re-architecting a 20K-line legacy app into a typed React SPA for 80K monthly users, to building a realtime multi-agent voice chat, to moving workers onto Terraform-provisioned Kubernetes.",
    'Outside of work I built a C compiler that targets LLVM IR and researched accelerated gradient methods. I write here about the systems I build and what broke along the way.',
  ],
  impact: [
    {
      value: '99%',
      label: 'Less Redis memory',
      detail:
        'Direct-to-S3 ingestion with pre-signed URLs, raising the upload limit from 20MB to 500MB.',
    },
    {
      value: '71%',
      label: 'Lower latency',
      detail: 'Migrated LLM/STT models with zero eval regressions, saving $10K/year in API costs.',
    },
    {
      value: '80K',
      label: 'Monthly users',
      detail: 'On a React/TypeScript SPA re-architected from a 20K-LOC legacy app.',
    },
  ] satisfies ImpactMetric[],
  writingEmpty: 'Posts are on the way.',
  writingAll: 'All writing →',
};

export const projects: Project[] = [
  {
    name: 'C Compiler',
    stack: ['C++', 'Flex', 'Bison', 'LLVM'],
    summary: 'An end-to-end C compiler that lowers to LLVM IR.',
    bullets: [
      'Built an end-to-end C compiler with Flex and Bison using a two-pass architecture: symbol collection, then semantic analysis and LLVM IR code generation',
      'Designed a type-safe AST with 15+ node types using C++17 std::variant and move semantics',
    ],
  },
];

export const pages = {
  work: {
    title: 'Work',
    description: 'Experience at Shopify, IBM, the University of Waterloo and Civiconnect.',
    heading: 'Work',
    intro: 'Internships and research, most recent first.',
  },
  writing: {
    title: 'Writing',
    description: 'Notes on infrastructure, compilers, realtime systems and the bugs in between.',
    heading: 'Writing',
    intro: 'Notes on systems I build and what broke along the way.',
    filterLabel: 'Filter by topic',
    allTopics: 'All',
    empty: 'No posts yet.',
    backLink: '← All writing',
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Dami Peng by email or LinkedIn.',
    heading: 'Contact',
    intro: 'The fastest way to reach me is email. I usually reply within a day or two.',
  },
  notFound: {
    title: 'Not found',
    description: "This page doesn't exist.",
    heading: 'Page not found',
    body: "The page you're looking for doesn't exist or has moved.",
    back: '← Back home',
  },
  comments: {
    heading: 'Comments',
    placeholder: 'Comments are coming soon.',
  },
  footer: {
    rss: 'RSS',
  },
  skipLink: 'Skip to content',
};
