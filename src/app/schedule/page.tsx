import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "schedule",
  description: `Shape of the day for ${site.title} — ${site.eventDateHuman}, ${site.city}.`,
};

const blocks = [
  { time: "09:00", label: "doors · coffee · badge pickup" },
  { time: "09:30", label: "welcome + how the machine works" },
  { time: "10:00", label: "keynote — speaker announced soon" },
  { time: "10:45", label: "challenge briefing · teams form" },
  { time: "11:00", label: "hacking begins — queue opens" },
  { time: "13:00", label: "lunch (the queue keeps running)" },
  { time: "15:30", label: "final submissions" },
  { time: "16:00", label: "judging · demos" },
  { time: "16:45", label: "awards · closing" },
];

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="readout mb-3 text-probe">schedule</p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        One day. Shaped like this.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        {site.eventDateHuman} · {site.city} · venue announced soon
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded border border-entangle/40 bg-entangle/10 px-3 py-2">
        <span className="readout text-entangle">provisional</span>
        <span className="text-sm text-fg-muted">
          times settle by {site.scheduleFinalBy}
        </span>
      </div>

      <ol className="mt-12 border-l border-line">
        {blocks.map(({ time, label }) => (
          <li key={time} className="relative pb-8 pl-8 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[5px] top-1.5 size-[9px] rounded-full border border-probe/60 bg-void"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="font-mono text-sm tabular-nums text-probe">
                {time}
              </span>
              <span className="text-fg">{label}</span>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-14 text-sm leading-relaxed text-fg-muted">
        Can&apos;t stay the whole day? Register anyway —{" "}
        <Link
          href="/#register"
          className="text-fg underline decoration-line underline-offset-4 hover:text-probe"
        >
          seats are limited
        </Link>
        .
      </p>
    </div>
  );
}
