# Theo Live — a transparent AI trading lab

Watch an AI learn to day-trade. Every win, every loss, every refuted idea — published.

**Theo** is a private research lab where Claude (Anthropic's AI) trades NASDAQ:TSLA
on **paper** — no real money — under a strict evidence discipline: every rule idea is
pre-registered, tested out-of-sample, and promoted only if it clears a statistical
bar. Ideas that fail are published as **REFUTED**, not buried. This repo hosts the
public dashboard and its sanitized data feed.

## What gets published

- Market catalysts for the day (scheduled events only)
- A plain-language market bias read and the day's strategy family
- A delayed, sanitized play-by-play feed of the lab's session — in two voices
  (calm analyst, or full soccer-match commentator)
- The honest scoreboard: net result in R, wins AND losses, days into the
  30-session incubation, and how many of our own ideas we've refuted

## What never gets published

- Raw market data (prices, candles, order-book) — qualitative descriptions only
- The strategy internals: exact levels, triggers, configuration, code
- Real-time information — intraday events are delayed by design

## ⚠️ This is a test lab, not advice

Everything here is **simulated paper trading** for research and education.
Nothing on this site or in this repository is investment advice, a
recommendation, or a solicitation to buy or sell any security. Simulated
results do not reflect real execution. Do your own research; consult a
licensed advisor before risking money.

## Structure

- `site/` — the dashboard (Vite + React, deployed on Vercel)
- `feed/` — the sanitized data feed (JSON, pushed by the private lab's publisher)
