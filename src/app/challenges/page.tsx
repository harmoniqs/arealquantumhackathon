import type { Metadata } from "next";
import Countdown from "@/components/Countdown";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "challenges",
  description:
    "Open problems at the intersection of quantum optimal control and neutral-atom hardware. Challenges are shared ahead of time with those chosen to participate.",
};

// challenge directions are not confirmed — nothing legible ships here
const locked = [
  { id: "01", noise: "▓▓▒░▓ ▒▓▓░ ░▒▓▓▒ ▓░▒ ▒▓▒▓░▓ ▓▒░▓ ▒▒▓░ ▓▓▒▒░▓▒ ░▓▒▓ ▒░▓" },
  { id: "02", noise: "▒░▓▓▒ ▓▒▓░ ▓░▒▒▓ ▒▓░▓▒▓ ░▓▒ ▓▒▓▓░ ▒▓░▒ ▓▒░▓▓ ░▒▓▒ ▓▓░" },
  { id: "03", noise: "▓▒░▓▓ ░▒▓▒ ▒▓▓░▒ ▓░▓▒ ▒▒▓▓░ ▓▒░▒▓ ░▓▓▒ ▒▓░▓ ▓▒▓░▒ ░▓▒" },
];

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="readout mb-4 text-brand">challenges</p>
      <h1 className="pixel-h text-balance text-5xl sm:text-7xl">
        Open problems, real hardware.
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">
        We&apos;re designing around open problems at the intersection of
        quantum optimal control and neutral-atom hardware.
      </p>

      <div className="mt-10">
        <Countdown
          target={site.challengeUnlock}
          doneLabel="unlocked — shared with selected participants"
        />
      </div>

      <div className="mt-14 space-y-6">
        {locked.map(({ id, noise }) => (
          <div key={id} className="card-pixel p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="readout text-fg-muted">challenge {id}</p>
              <span className="readout text-brand/70">locked</span>
            </div>
            <p
              className="mt-3 font-mono text-sm text-fg-muted/50 blur-[2px] select-none"
              aria-hidden="true"
            >
              {noise}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-14 text-sm leading-relaxed text-fg-muted">
        Challenges will be shared ahead of time with those who are chosen to
        participate.
      </p>
    </div>
  );
}
