// Work history. Facts come from public/resume.pdf; wording follows the design handoff mockups.
// /work renders from this. Entries are ordered as they appear (incoming first, then newest first).

export interface WorkTerm {
  /** Sub-section heading, e.g. "Fall 2026 · Infrastructure". */
  label: string;
  bullets: string[];
}

export interface WorkLogo {
  /** Path under public/ for light backgrounds, e.g. "/logos/ibm.svg". */
  src: string;
  /** Optional variant swapped in under prefers-color-scheme: dark. */
  darkSrc?: string;
  /**
   * Height of the logo's capital (or ascender) letters as a fraction of the file's height. Used to
   * scale every logo to the same lettering size. Measured from the artwork.
   */
  capHeight: number;
  /**
   * Transparent padding baked into the file, as fractions of its size. Collapsed with negative
   * margins so the file stays unmodified (used for logos supplied with required clear space).
   */
  padding?: { top: number; right: number; bottom: number; left: number };
}

export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  dates: string;
  location: string;
  /** Present for an accepted offer that hasn't started yet; renders an "Incoming" badge. */
  status?: 'incoming';
  /** Multiple terms at the same company render as sub-sections. */
  terms: WorkTerm[];
  bullets: string[];
  tags: string[];
  /** Falls back to a text wordmark if the file is missing. */
  logo?: WorkLogo;
}

export const work: WorkEntry[] = [
  {
    id: 'shopify',
    company: 'Shopify',
    role: 'Software Engineer Intern',
    dates: 'Winter 2027',
    location: 'Toronto',
    status: 'incoming',
    terms: [],
    bullets: [],
    tags: ['Go', 'Rust', 'Terraform', 'Kubernetes'],
    logo: { src: '/logos/shopify.svg', darkSrc: '/logos/shopify-dark.svg', capHeight: 0.607 },
  },
  {
    id: 'ibm',
    company: 'IBM',
    role: 'Software Engineer Intern — Skills Network',
    dates: 'Jan – Dec 2026',
    location: 'Toronto',
    terms: [
      {
        label: 'Fall 2026 · Infrastructure',
        bullets: [
          'Cut Redis memory 99% and raised the upload limit from 20MB to 500MB with direct-to-S3 ingestion via pre-signed URLs.',
          'Split the TypeScript/Express server and compute-heavy workers into separate Terraform-provisioned Kubernetes deployments — isolated failures, independent scaling, $7K/year saved.',
          'Fixed lost WebSocket events for 83% of users by fanning worker emits out to all 6 API replicas over Redis Pub/Sub.',
        ],
      },
      {
        label: 'Summer 2026 · Product + AI',
        bullets: [
          'Re-architected a 20K-LOC legacy app as a React/TypeScript SPA for 80K monthly users, with merge-blocking OpenAPI contract checks that caught 10+ breaking changes.',
          'Cut latency 71% and $10K/year in API costs by migrating LLM/STT models with zero eval regressions.',
          'Built realtime multi-agent voice chat on a LangGraph state machine, streaming TTS for sub-1.2s first audio across 92 languages.',
        ],
      },
      {
        label: 'Winter 2026 · Platform',
        bullets: [
          'Replaced pod log searches with per-job Bull Board logs for 24K monthly BullMQ jobs, surfacing 20+ bugs.',
          'Built JSON/HTML/MD translation APIs with AST serialization to preserve structure, cutting hallucinations 40%.',
          'Moved 100+ annual portal deployments to Terraform GitOps on GitHub Actions, removing local credentials.',
        ],
      },
    ],
    bullets: [],
    tags: [
      'TypeScript',
      'Kubernetes',
      'Terraform',
      'Redis',
      'AWS S3',
      'BullMQ',
      'React',
      'LangGraph',
      'OpenAI',
      'ElevenLabs',
      'Docker',
      'GitOps',
      'NGINX',
    ],
    logo: { src: '/logos/ibm.svg', capHeight: 1 },
  },
  {
    id: 'uwaterloo',
    company: 'University of Waterloo',
    role: 'Undergraduate Research Assistant · Accelerated Gradient Descent',
    dates: 'Sep – Dec 2025',
    location: 'Waterloo',
    terms: [],
    bullets: [
      'Built a PyTorch harness to benchmark gradient-descent optimizers on CIFAR-10 classifiers.',
      'Extended accelerated optimization algorithms for 10% faster convergence than baseline optimizers.',
    ],
    tags: ['Python', 'PyTorch', 'Pandas', 'Gradient Descent', 'Mathematical Optimization'],
    // Official PNGs from the university's logo download, used unaltered (they include clear space).
    logo: {
      src: '/logos/uwaterloo.png',
      darkSrc: '/logos/uwaterloo-dark.png',
      capHeight: 0.169,
      padding: { top: 0.278, right: 0.138, bottom: 0.287, left: 0.136 },
    },
  },
  {
    id: 'civiconnect',
    company: 'Civiconnect',
    role: 'Software Developer Intern · Nurse Recruit',
    dates: 'Jan – Apr 2025',
    location: 'Toronto',
    terms: [],
    bullets: [
      'Built a Retool dashboard over Supabase Postgres so non-technical clients self-manage 1,000+ user profiles and credit balances.',
      'Moved Postgres event listeners to Supabase Realtime broadcasts, cutting job-update latency 66%.',
      'Integrated the Stripe API to automate billing across 60+ monthly transactions.',
    ],
    tags: ['Supabase', 'TypeScript', 'AWS S3', 'Stripe API', 'Postgres', 'React'],
    logo: {
      src: '/logos/civiconnect.svg',
      darkSrc: '/logos/civiconnect-dark.svg',
      capHeight: 0.831,
    },
  },
];
