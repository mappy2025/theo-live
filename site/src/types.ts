export type Voice = 'analyst' | 'commentator'

export interface FeedEvent {
  id: string
  time: string
  kind: string
  analyst: string
  commentator: string
}

export interface TodayFeed {
  date: string
  updatedAt: string
  status: 'pre-open' | 'live' | 'closed'
  catalysts: { today: string[]; next: string[]; nextLabel: string; note?: string }
  bias: { state: string; analyst: string; commentator: string; updatedAt: string } | null
  /** "What Theo is watching today" — the sanitized morning brief (qualitative only). */
  brief?: { analyst: string; commentator: string; watchingFor: string[]; updatedAt: string } | null
  strategyFamily: { label: string; analyst: string; commentator: string } | null
  dayR: number | null
  events: FeedEvent[]
}

export interface Scoreboard {
  updatedAt: string
  sessions: number
  tradeWins: number
  tradeLosses: number
  netR: number
  incubationDay: number
  incubationTotal: number
  candidatesRegistered: number
  refutedIdeas: number
  note: string
}
