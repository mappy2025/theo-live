// Where the dashboard reads its sanitized feed from.
// Dev: served from the local ../feed folder (vite middleware).
// Prod: the public repo's raw files — pushed by the private lab's publisher.
export const FEED_BASE = import.meta.env.PROD
  ? 'https://raw.githubusercontent.com/mappy2025/theo-live/main/feed'
  : '/feed'

export const POLL_MS = 60_000

// Stripe Payment Links — paste the real links here when the Stripe account is
// ready. Empty string = button renders as "coming soon" (disabled).
export const DONATE_TIERS: { amount: string; reward: string; url: string }[] = [
  { amount: '$10', reward: 'Founders wall mention', url: '' },
  { amount: '$25', reward: '3 months of membership at launch', url: '' },
  { amount: '$100', reward: '1 year of membership at launch', url: '' },
]
