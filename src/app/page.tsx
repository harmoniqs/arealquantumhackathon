import Link from "next/link";
import HeroSection from "@/components/hero/HeroSection";
import LumaEmbed from "@/components/LumaEmbed";
import { site } from "@/lib/site";

const facts = [
  { label: "date", value: "july 29, 2026" },
  { label: "venue", value: "microsoft garage · soho, nyc" },
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
    title: "Shape real pulses",
    body: "Analog control is a different sport: you sculpt global drives and ride the physics. The best pulse wins — the hardware is the judge.",
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

      <section aria-label="Event facts" className="border-y-2 border-line/70 bg-panel/40">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
          {facts.map(({ label, value }) => (
            <div key={label} className="px-4 py-5 sm:px-6">
              <dt className="readout mb-2 text-brand">{label}</dt>
              <dd className="text-sm text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="readout mb-4 text-brand">why &ldquo;real&rdquo;</p>
        <h2 className="pixel-h max-w-2xl text-balance text-4xl sm:text-5xl">
          Most quantum hackathons end at the simulator. This one starts where
          the simulator stops.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {tracks.map(({ title, body }) => (
            <div key={title} className="card-pixel p-6">
              <h3 className="pixel-h mb-3 text-2xl">{title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-fg-muted">
          full challenge specifications decrypt on{" "}
          <Link
            href="/challenges"
            className="text-fg underline decoration-line underline-offset-4 hover:text-brand"
          >
            the challenges page
          </Link>{" "}
          before the event.
        </p>
      </section>

      <section id="register" className="border-t-2 border-line/70 bg-panel/30">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <p className="readout mb-4 text-brand">register</p>
          <h2 className="pixel-h text-balance text-4xl sm:text-5xl">
            Seats are quantized. Reserve yours.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">
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
