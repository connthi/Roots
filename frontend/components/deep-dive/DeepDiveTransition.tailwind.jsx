/**
 * Tailwind CSS reference mockup (requires Tailwind in your project).
 * Production component: DeepDiveTransition.jsx + CSS modules.
 *
 * Usage: copy classes into your Tailwind setup, or install tailwindcss in frontend.
 */

import Link from 'next/link';
import { getDeepDiveTransition } from '../../lib/deepDive/transitionCopy.js';

export function DeepDiveTransitionTailwind({ archetype }) {
  const copy = getDeepDiveTransition(archetype);

  return (
    <section className="relative mx-auto mb-8 max-w-5xl overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#1a2218] via-[#0f1410] to-[#141c16] p-6 shadow-2xl shadow-black/40 md:p-8">
      <motionDiv
        className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5">
              {copy.stepLabel}
            </span>
          </p>

          <h2 className="mb-3 text-2xl font-extrabold leading-tight text-zinc-50 md:text-3xl">
            {copy.headline}
          </h2>

          <p className="mb-4 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
            {copy.subhead}
          </p>

          {copy.callout && (
            <p className="mb-4 border-l-2 border-emerald-400 bg-emerald-500/5 py-2 pl-3 text-sm text-emerald-100/90">
              {copy.callout}
            </p>
          )}

          <ul className="mb-4 space-y-2">
            {copy.bullets.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-zinc-300">
                <span className="font-bold text-emerald-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mb-5 space-y-1 text-xs text-zinc-500">
            {copy.flourishes.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/deep-dive"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 transition hover:brightness-110"
            >
              {copy.ctaPrimary}
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              className="text-sm text-zinc-500 underline underline-offset-4 hover:text-zinc-300"
            >
              {copy.ctaSecondary}
            </button>
          </div>

          <p className="mt-3 text-[11px] tracking-wide text-zinc-600">{copy.trustLine}</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-black/30 p-4" aria-hidden>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            {copy.chartLabel}
          </p>
          <div className="flex h-24 items-end gap-1.5">
            {[35, 48, 62, 78, 92].map((h) => (
              <div
                key={h}
                className="flex-1 rounded-t-md bg-zinc-600/60"
                style={{ height: `${h}%` }}
              />
            ))}
            <div className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20" style={{ height: '95%' }} />
          </div>
          <motionDiv className="mt-3 flex justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-zinc-600" /> Current path
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> With your real data
            </span>
          </motionDiv>
          <p className="mt-3 text-center text-xs font-semibold text-emerald-400">🔒 Unlocks after 10 inputs</p>
        </div>
      </div>
    </section>
  );
}

function motionDiv({ className, children, ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
