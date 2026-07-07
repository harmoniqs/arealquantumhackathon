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
      <p className="readout mb-4 text-fg-muted">
        {site.eventDateHuman} · {site.city} · real neutral-atom hardware
      </p>
      <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
        a real quantum hackathon
      </h1>
      <div aria-hidden="true" className="my-10 flex items-center gap-6">
        <i className="size-3 rounded-full bg-atom inline-block" />
        <i className="size-3 rounded-full bg-atom inline-block" />
        <i className="size-3 rounded-full bg-error inline-block" />
        <i className="size-3 rounded-full bg-atom inline-block" />
        <i className="size-3 rounded-full bg-atom inline-block" />
      </div>
      <p className="max-w-xl text-pretty leading-relaxed text-fg-muted">
        Five atoms hold a protected state. An error strikes one; the flanking
        Z·X·Z stabilizers flip and give it away; the decoder undoes the damage.
        That loop is quantum error correction — and on July 29 you&apos;ll run it
        on real analog hardware, from your editor.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/#register"
          className="readout rounded border border-probe bg-probe/10 px-6 py-3 text-probe transition-colors hover:bg-probe/20"
        >
          register
        </Link>
        <Link
          href="/challenges"
          className="readout rounded border border-line px-6 py-3 text-fg-muted transition-colors hover:border-fg-muted hover:text-fg"
        >
          see the challenges
        </Link>
      </div>
    </section>
  );
}
