import type { Metadata } from "next";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "challenges",
  description:
    "Hands-on challenges on real neutral-atom hardware. Full specifications decrypt before the event.",
};

const teasers = [
  {
    id: "01",
    hint: "level one",
    scramble: "Get your pulses onto real atoms and bring clean data back.",
  },
  {
    id: "02",
    hint: "level two",
    scramble: "Keep a fragile quantum state alive while the pulse budget runs out.",
  },
  {
    id: "03",
    hint: "boss level",
    scramble: "The hardware fights back. Outsmart the noise for the win.",
  },
];

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="readout mb-4 text-brand">challenges</p>
      <h1 className="pixel-h text-balance text-5xl sm:text-7xl">
        Specifications decrypt soon.
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">
        What we can say now: the challenges are{" "}
        <strong className="text-fg">analog-only</strong>, they run on{" "}
        <strong className="text-fg">real neutral-atom hardware</strong>, and
        they&apos;re about{" "}
        <strong className="text-fg">
          keeping quantum information alive on a live machine
        </strong>
        . Registered teams get the full specs here, with time to prepare before
        the event.
      </p>

      <div className="mt-10">
        <Countdown
          target={site.challengeUnlock}
          doneLabel="unlocked — specifications publishing shortly"
        />
      </div>

      <div className="mt-14 space-y-6">
        {teasers.map(({ id, hint, scramble }) => (
          <div key={id} className="card-pixel p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="readout text-fg-muted">
                challenge {id} · <span className="text-brand">{hint}</span>
              </p>
              <span className="readout text-fg-muted/60">locked</span>
            </div>
            <p
              className="mt-3 text-sm leading-relaxed text-fg-muted blur-[3px] select-none"
              aria-hidden="true"
            >
              {scramble}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-14 text-sm leading-relaxed text-fg-muted">
        Want the specs the moment they land?{" "}
        <Link
          href="/#register"
          className="text-fg underline decoration-line underline-offset-4 hover:text-brand"
        >
          Register
        </Link>{" "}
        and they&apos;ll reach your inbox first.
      </p>
    </div>
  );
}
