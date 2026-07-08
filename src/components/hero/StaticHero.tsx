import Link from "next/link";
import { site } from "@/lib/site";

// Reduced-motion fallback: the whole story as still content, no canvas.
export default function StaticHero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,124,246,0.12),transparent_60%)]"
      />
      <p className="readout mb-5 text-fg-muted">
        {site.eventDateHuman} · {site.city} · real neutral-atom hardware
      </p>
      <h1 className="pixel-h text-balance text-6xl sm:text-8xl">
        a real quantum hackathon
      </h1>
      <div aria-hidden="true" className="my-10 flex items-center gap-6">
        <i className="size-3 bg-atom inline-block" />
        <i className="size-3 bg-atom inline-block" />
        <i className="size-3 bg-brand inline-block" />
        <i className="size-3 bg-atom inline-block" />
        <i className="size-3 bg-atom inline-block" />
      </div>
      <p className="max-w-xl text-pretty leading-relaxed text-fg-muted">
        Single atoms held in a lattice of laser light, programmed with analog
        pulses instead of gates — and noisy enough to keep things interesting.
        On July 29 you&apos;ll drive a real neutral-atom machine from your
        editor, in one day of hands-on challenges.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        <Link href="/#register" className="btn-pixel">
          register
        </Link>
        <Link href="/challenges" className="btn-ghost">
          the challenges
        </Link>
      </div>
    </section>
  );
}
