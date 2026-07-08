import Link from "next/link";
import { site } from "@/lib/site";

// Reduced-motion fallback: the story as still content, no canvas.
export default function StaticHero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.12),transparent_60%)]"
      />
      <p className="readout mb-5 text-fg-muted">
        wednesday, july 29, 2026 · microsoft garage, nyc
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
        Pulse-level access, analog hardware, and open problems in Quantum Error
        Correction. Most quantum hackathons run on simulators or gate-level
        abstractions. This one doesn&apos;t.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        <Link href={`/#apply`} className="btn-pixel">
          apply
        </Link>
        <Link href="/challenges" className="btn-ghost">
          the challenges
        </Link>
      </div>
      <p className="sr-only">{site.description}</p>
    </section>
  );
}
