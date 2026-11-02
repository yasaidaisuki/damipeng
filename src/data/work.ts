// Work history, transcribed from public/resume.pdf. /work and the home page render from this.
// Entries are ordered as they should appear on /work (incoming first, then reverse-chronological).

export interface WorkTerm {
  /** Sub-section heading, e.g. "Fall 2026 · Infrastructure". */
  label: string;
  dates: string;
  bullets: string[];
  tags: string[];
}

export interface WorkBrand {
  /** Colors for the 40×4px bar above the company name; several colors render as equal segments. */
  bar: string[];
  /** Render the logo on a small dark tile (for white logos). */
  logoTile?: 'dark';
  /** Render the company as a styled text wordmark instead of a logo. */
  wordmark?: 'waterloo';
}

export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  dates: string;
  location: string;
  /** Present for an accepted offer that hasn't started yet. */
  status?: 'incoming';
  /** Short line shown when there are no bullets yet (e.g. incoming roles). */
  note?: string;
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
    location: 'Toronto, ON',
    status: 'incoming',
    note: 'Incoming. Starting January 2027.',
    terms: [],
    bullets: [],
    tags: [],
    logo: '/logos/shopify.svg',
    brand: { bar: ['#95BF47'] },
  },
  {
    id: 'ibm',
    company: 'IBM',
    role: 'Software Engineer Intern · Skills Network',
    dates: 'Jan – Dec 2026',
    location: 'Toronto, ON',
    terms: [
      {
        label: 'Fall 2026 · Infrastructure',
        dates: 'Sep – Dec 2026',
        bullets: [
          'Cut Redis memory 99% and raised uploads from 20MB to 500MB via direct-to-S3 ingestion with pre-signed URLs',
          'Decoupled TypeScript/Express server and compute-intensive workers into Terraform-provisioned Kubernetes deployments, isolating worker failures and enabling independent scaling while saving $7K/year',
          'Fixed lost WebSocket events for 83% of users by fanning out worker emits to all 6 API replicas via Redis Pub/Sub',
        ],
        tags: ['TypeScript', 'Express', 'Kubernetes', 'Terraform', 'Redis', 'AWS S3', 'WebSockets'],
      },
      {
        label: 'Summer 2026 · Product + AI',
        dates: 'May – Aug 2026',
        bullets: [
          'Re-architected a 20K-LOC legacy app as a React/TypeScript SPA serving 80K monthly users, enforcing type-safe OpenAPI contracts via merge-blocking CI checks that caught 10+ breaking API changes before production',
          'Cut latency 71% and saved $10K/year in API costs by migrating LLM/STT models with zero eval regressions',
          'Built a realtime multi-agent voice chat in TypeScript using a LangGraph state machine and an LLM to route turns, streaming TTS output to achieve sub-1.2s first-audio latency across 92 languages',
        ],
        tags: ['React', 'TypeScript', 'OpenAPI', 'LangGraph', 'LLMs', 'TTS/STT'],
      },
      {
        label: 'Winter 2026 · Platform',
        dates: 'Jan – Apr 2026',
        bullets: [
          'Replaced pod log searches with per-job Bull Board logs for 24K monthly BullMQ jobs, surfacing 20+ bugs',
          'Built JSON/HTML/MD translation APIs using AST serialization to preserve structure, cutting hallucinations 40%',
          'Migrated 100+ annual portal deployments to Terraform GitOps via GitHub Actions, removing local credentials',
        ],
        tags: ['BullMQ', 'Node.js', 'Terraform', 'GitHub Actions', 'ASTs'],
      },
    ],
    bullets: [],
    tags: [],
    logo: '/logos/ibm.svg',
    brand: { bar: ['#0F62FE'] },
  },
  {
    id: 'uwaterloo',
    company: 'University of Waterloo',
    role: 'Undergraduate Research Assistant · Accelerated Gradient Descent',
    dates: 'Sep – Dec 2025',
    location: 'Waterloo, ON',
    terms: [],
    bullets: [
      'Trained CIFAR-10 image classifiers in PyTorch, building a harness to benchmark gradient-descent optimizers',
      'Extended accelerated optimization algorithms, achieving 10% faster training convergence vs baseline optimizers',
    ],
    tags: ['Python', 'PyTorch', 'Optimization'],
    brand: { bar: ['#FED34C', '#E4B429', '#000000'], wordmark: 'waterloo' },
  },
  {
    id: 'civiconnect',
    company: 'Civiconnect',
    role: 'Software Developer Intern · Nurse Recruit',
    dates: 'Jan – Apr 2025',
    location: 'Toronto, ON',
    terms: [],
    bullets: [
      'Engineered an internal Retool dashboard over Supabase PostgreSQL, letting non-technical clients self-manage 1,000+ user profiles and credit balances',
      'Migrated Postgres event listeners to Supabase Realtime broadcasts, reducing job update latency by 66%',
      'Integrated Stripe API to automate billing, eliminating manual invoicing across 60+ transactions per month',
    ],
    tags: ['Supabase', 'PostgreSQL', 'Retool', 'Stripe'],
    logo: '/logos/civiconnect.svg',
    // TODO: swap for Civiconnect's brand color.
    brand: { bar: ['#2347C6'], logoTile: 'dark' },
  },
];
