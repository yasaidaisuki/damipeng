// Work history. Facts come from public/resume.pdf; wording follows the design handoff mockups.
// /work renders from this. Entries are ordered as they appear (incoming first, then newest first).

export interface WorkTerm {
  /** Sub-section heading, e.g. "Fall 2026 · Infrastructure". */
  label: string;
  bullets: string[];
}

export interface WorkBrand {
  /** Colors for the 40×4px bar above the company name; several colors render as equal segments. */
  bar: string[];
  /** Square bar ends instead of the default 2px radius (IBM). */
  squareBar?: boolean;
  /** Render the logo on a small dark tile (for white logos). */
  logoTile?: 'dark';
  /** Render the company as a styled text wordmark instead of a logo. */
  wordmark?: 'waterloo';
  /** Typeface for the role line (IBM uses IBM Plex Mono). */
  roleFont?: 'plex-mono';
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
  /** Path under public/, e.g. "/logos/ibm.svg". Falls back to a text wordmark if the file is missing. */
  logo?: string;
  brand: WorkBrand;
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
    tags: [],
    logo: '/logos/shopify.svg',
    brand: { bar: ['#008060'] },
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
    ],
    logo: '/logos/ibm.svg',
    brand: { bar: ['#0F62FE'], squareBar: true, roleFont: 'plex-mono' },
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
    tags: [],
    brand: { bar: ['#FED34C', '#F2B705', '#111113'], squareBar: true, wordmark: 'waterloo' },
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
    tags: [],
    logo: '/logos/civiconnect.svg',
    // TODO: swap for Civiconnect's brand color (the mockup leaves it as a placeholder).
    brand: { bar: ['#111113'], logoTile: 'dark' },
  },
];
