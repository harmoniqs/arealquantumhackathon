import Link from "next/link";
import HeroSection from "@/components/hero/HeroSection";
import LumaEmbed from "@/components/LumaEmbed";
import { site } from "@/lib/site";

const facts = [
  { label: "date", value: "july 29, 2026" },
  { label: "location", value: "new york city" },
  { label: "format", value: "one day · in person · teams" },
  { label: "hardware", value: "neutral atoms · analog mode" },
  { label: "interface", value: "vs code → real cloud qpu" },
  { label: "prizes", value: "compute credits · details soon" },
];

const tracks = [
  {
    title: "Drive real atoms",
    body: "No simulator cosplay. Your pulses run on a production neutral-atom machine in analog mode, queued straight from a VS Code extension.",
  },
  {
    title: "Correct real errors",
    body: "The challenge is analog fault tolerance: syndrome extraction on a five-atom chain. The same physics as the animation above — except the errors won't wait for your scroll.",
  },
  {
    title: "Beat real decoherence",
    body: "T1 doesn't care how elegant your theory is. Teams are scored on what survives contact with hardware.",
  },
];

export default function Home() {
  return (
    <>
      <h1 className="sr-only">{site.title}</h1>
      <HeroSection />

      <section aria-label="Event facts" className="border-y border-line/60 bg-panel/40">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
          {facts.map(({ label, value }) => (
            <div key={label} className="px-4 py-5 sm:px-6">
              <dt className="readout mb-1 text-fg-muted">{label}</dt>
              <dd className="text-sm text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="readout mb-3 text-probe">why &ldquo;real&rdquo;</p>
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Most quantum hackathons end at the simulator. This one starts where
          the simulator stops.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tracks.map(({ title, body }) => (
            <div
              key={title}
              className="rounded-lg border border-line bg-panel/50 p-6 transition-colors hover:border-entangle/60"
            >
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-fg-muted">
          full challenge specifications decrypt on{" "}
          <Link
            href="/challenges"
            className="text-fg underline decoration-line underline-offset-4 hover:text-probe"
          >
            the challenges page
          </Link>{" "}
          before the event.
        </p>
      </section>

      <section className="border-t border-line/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="readout text-center text-fg-muted">
            co-hosted with a neutral-atom hardware partner ·{" "}
            <span className="text-entangle">announcement in progress</span>
          </p>
        </div>
      </section>

      <section id="register" className="border-t border-line/60 bg-panel/30">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <p className="readout mb-3 text-probe">register</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Seats are quantized. Reserve yours.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
            Registration is free, with host approval. Space is limited by the
            venue — and by how many teams one machine can keep honest for a
            day.
          </p>
          <div className="mt-10">
            <LumaEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
