import { useEffect, useState } from 'react'
import { FEED_BASE, POLL_MS, DONATE_TIERS } from './config'
import type { TodayFeed, Scoreboard, Voice, FeedEvent } from './types'

const KIND_ICON: Record<string, string> = {
  system: '📣',
  kickoff: '🔔',
  chance: '👀',
  attack: '⚔️',
  goal: '⚽',
  conceded: '🥅',
  exit: '🚪',
  advisory: '🧠',
  fulltime: '🔚',
  bias: '🧭',
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${FEED_BASE}/${path}?t=${Math.floor(Date.now() / 30000)}`)
    if (!r.ok) return null
    return (await r.json()) as T
  } catch {
    return null
  }
}

function useFeed() {
  const [today, setToday] = useState<TodayFeed | null>(null)
  const [score, setScore] = useState<Scoreboard | null>(null)
  useEffect(() => {
    let alive = true
    const load = async () => {
      const [t, s] = await Promise.all([
        getJson<TodayFeed>('today.json'),
        getJson<Scoreboard>('scoreboard.json'),
      ])
      if (!alive) return
      if (t) setToday(t)
      if (s) setScore(s)
    }
    load()
    const id = setInterval(load, POLL_MS)
    return () => { alive = false; clearInterval(id) }
  }, [])
  return { today, score }
}

function VoiceToggle({ voice, setVoice }: { voice: Voice; setVoice: (v: Voice) => void }) {
  return (
    <div>
      <div className="voice-toggle" role="tablist" aria-label="Feed voice">
        <button className={voice === 'commentator' ? 'on' : ''} onClick={() => setVoice('commentator')}>
          ⚽ Commentator
        </button>
        <button className={voice === 'analyst' ? 'on' : ''} onClick={() => setVoice('analyst')}>
          🎓 Analyst
        </button>
      </div>
      <span className="voice-hint">
        {voice === 'commentator' ? 'the trading day, called like a match' : 'the same events, explained calmly'}
      </span>
    </div>
  )
}

function Catalysts({ today }: { today: TodayFeed }) {
  const c = today.catalysts
  return (
    <section className="card">
      <h2>Market catalysts</h2>
      <div className="cat-line">
        <span className="cat-day">Today</span>
        {c.today.length
          ? <span className="cat-events">{c.today.join(' · ')}</span>
          : <span className="cat-none">none scheduled</span>}
      </div>
      <div className="cat-line">
        <span className="cat-day">{c.nextLabel}</span>
        {c.next.length
          ? <span className="cat-events">{c.next.join(' · ')}</span>
          : <span className="cat-none">none scheduled</span>}
      </div>
      {c.note && <p className="muted small">{c.note}</p>}
    </section>
  )
}

function Bias({ today, voice }: { today: TodayFeed; voice: Voice }) {
  return (
    <section className="card">
      <h2>Market bias</h2>
      {today.bias ? <p>{today.bias[voice]}</p> : <p className="muted">No read yet.</p>}
      {today.strategyFamily && (
        <p className="muted small">
          Playing style today: <strong>{today.strategyFamily.label}</strong> — {today.strategyFamily[voice]}
        </p>
      )}
    </section>
  )
}

function Feed({ today, voice }: { today: TodayFeed; voice: Voice }) {
  const events = [...today.events].reverse()
  return (
    <section className="card">
      <h2>{voice === 'commentator' ? 'Match feed' : 'Session feed'}</h2>
      {events.length === 0 && <div className="feed-empty">Quiet for now — events appear here during the trading day.</div>}
      <ul className="feed">
        {events.map((e: FeedEvent) => (
          <li key={e.id}>
            <span className="t">{e.time}</span>
            <span className="kind">{KIND_ICON[e.kind] ?? '•'}</span>
            <span className="msg">{e[voice]}</span>
          </li>
        ))}
      </ul>
      <div className="delay-note">
        Intraday events are published with a deliberate delay and without price levels.
        This feed is a research diary, not a signal service.
      </div>
    </section>
  )
}

function ScoreboardCard({ score }: { score: Scoreboard }) {
  const net = score.netR
  return (
    <section className="card">
      <h2>The honest scoreboard</h2>
      <div className="score-grid">
        <div className="score-cell">
          <div className={`v ${net > 0 ? 'pos' : net < 0 ? 'neg' : ''}`}>{net > 0 ? '+' : ''}{net.toFixed(2)}R</div>
          <div className="k">net result</div>
        </div>
        <div className="score-cell">
          <div className="v">{score.tradeWins}W–{score.tradeLosses}L</div>
          <div className="k">paper trades</div>
        </div>
        <div className="score-cell">
          <div className="v">{score.sessions}</div>
          <div className="k">sessions</div>
        </div>
        <div className="score-cell">
          <div className="v">{score.incubationDay}/{score.incubationTotal}</div>
          <div className="k">incubation</div>
        </div>
        <div className="score-cell">
          <div className="v">{score.refutedIdeas}</div>
          <div className="k">ideas refuted</div>
        </div>
      </div>
      <p className="muted small">{score.note}</p>
    </section>
  )
}

function Support() {
  return (
    <section className="card">
      <h2>Support the lab</h2>
      <p>
        Theo Live is an independent research experiment — no sponsors, no signal-selling,
        no real-money management. If watching an AI learn to trade in the open is worth
        something to you, you can fund the experiment. Early supporters become
        <strong> founding members</strong> when memberships launch.
      </p>
      <div className="tiers">
        {DONATE_TIERS.map((t) => (
          <div className="tier" key={t.amount}>
            <div className="amt">{t.amount}</div>
            <div className="reward">{t.reward}</div>
            {t.url
              ? <a className="btn" href={t.url} target="_blank" rel="noopener noreferrer">Support</a>
              : <span className="btn">coming soon</span>}
          </div>
        ))}
      </div>
      <p className="muted small">
        Donations fund research and infrastructure. They buy membership perks at launch —
        never trading signals, advice, or returns.
      </p>
    </section>
  )
}

function Disclaimer() {
  return (
    <section className="card disclaimer" id="disclaimer">
      <h2>Read this before anything else</h2>
      <h3>This is a test lab, not advice</h3>
      <p>
        Theo Live documents a research experiment in which an AI trades on <strong>paper </strong>
        — simulated positions, no real money. Nothing on this site is investment advice, a
        recommendation, an offer, or a solicitation to buy or sell any security or other
        financial instrument. The content is educational and entertainment material about
        the research process itself.
      </p>
      <h3>Simulated results are not real results</h3>
      <p>
        Paper trading does not account for real execution: slippage, partial fills, liquidity,
        fees, and the psychology of real loss. Simulated performance — good or bad — does not
        predict real performance. Past performance, simulated or real, never guarantees future results.
      </p>
      <h3>No reliance</h3>
      <p>
        Do not make financial decisions based on this feed. The bias reads and session events
        are deliberately delayed, deliberately vague about exact levels, and reflect an
        experimental system that has, by its own published scoreboard, not proven an edge.
        If you are considering trading, consult a licensed financial advisor in your jurisdiction.
      </p>
      <h3>Independence</h3>
      <p>
        Theo Live is not affiliated with, endorsed by, or connected to any broker, exchange,
        data provider, or Anthropic. Donations support the research project and its
        infrastructure only.
      </p>
    </section>
  )
}

export default function App() {
  const { today, score } = useFeed()
  const [voice, setVoice] = useState<Voice>(() =>
    (localStorage.getItem('voice') as Voice) || 'commentator')
  useEffect(() => { localStorage.setItem('voice', voice) }, [voice])

  const status = today?.status ?? 'pre-open'
  const statusLabel = status === 'live' ? '● LIVE' : status === 'closed' ? 'market closed' : 'pre-open'

  return (
    <>
      <div className="lab-banner">
        🧪 <strong>Paper-trading research lab.</strong> Simulated results, educational
        entertainment — <strong>not investment advice</strong>. <a href="#disclaimer" style={{ color: 'inherit' }}>Full disclaimer</a>
      </div>
      <div className="wrap">
        <header className="site">
          <div className="brand-row">
            <h1 className="brand">Theo <span className="live-dot">Live</span></h1>
            <span className={`status-chip ${status === 'live' ? 'live' : ''}`}>{statusLabel}</span>
          </div>
          <p className="tagline">
            Watch an AI learn to day-trade — every win, every loss, every refuted idea, published.
          </p>
          <VoiceToggle voice={voice} setVoice={setVoice} />
        </header>

        {today && <Catalysts today={today} />}
        {today && <Bias today={today} voice={voice} />}
        {today && <Feed today={today} voice={voice} />}
        {score && <ScoreboardCard score={score} />}
        {!today && !score && (
          <section className="card"><p className="muted">Loading the lab…</p></section>
        )}
        <Support />
        <Disclaimer />

        <footer>
          Theo Live · a transparent AI trading-lab experiment ·{' '}
          <a href="https://github.com/mappy2025/theo-live" style={{ color: 'inherit' }}>open feed on GitHub</a>
        </footer>
      </div>
    </>
  )
}
