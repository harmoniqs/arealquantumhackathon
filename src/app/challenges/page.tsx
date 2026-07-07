import type { Metadata } from "next";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "challenges",
  description:
    "Analog fault tolerance on real neutral-atom hardware. Full specifications decrypt before the event.",
};

const teasers = [
  {
    id: "01",
    hint: "syndrome extraction",
    scramble: "Z·X·Z stabilizers on a five-atom chain — measured for real, not assumed.",
  },
  {
    id: "02",
    hint: "analog fault tolerance",
    scramble: "Keep a protected state alive while the pulse budget runs out.",
  },
  {
    id: "03",
    hint: "the decoder's dilemma",
    scramble: "Your syndrome record is noisy too. Decode anyway.",
  },
];

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="readout mb-3 text-probe">challenges</p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Specifications decrypt soon.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">
        What we can say now: the challenges are <strong className="text-fg">analog-only</strong>,
        they run on <strong className="text-fg">real neutral-atom hardware</strong>, and they
        revolve around <strong className="text-fg">error correction on five atoms</strong> —
        the exact protocol animated on the front page. Registered teams get the
        full specs here, with time to prepare before the event.
      </p>

      <div className="mt-10">
        <Countdown
          target={site.challengeUnlock}
          doneLabel="unlocked — specifications publishing shortly"
        />
      </div>

      <div className="mt-14 space-y-4">
        {teasers.map(({ id, hint, scramble }) => (
          <div
            key={id}
            className="rounded-lg border border-line bg-panel/50 p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="readout text-fg-muted">
                challenge {id} · <span className="text-entangle">{hint}</span>
              </p>
              <span className="readout text-fg-muted/60">locked</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted blur-[3px] select-none" aria-hidden="true">
              {scramble}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-14 text-sm leading-relaxed text-fg-muted">
        Want the specs the moment they land?{" "}
        <Link
          href="/#register"
          className="text-fg underline decoration-line underline-offset-4 hover:text-probe"
        >
          Register
        </Link>{" "}
        and they&apos;ll reach your inbox first.
      </p>
    </div>
  );
}
