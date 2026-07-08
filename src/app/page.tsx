import HeroSection from "@/components/hero/HeroSection";
import LumaEmbed from "@/components/LumaEmbed";
import { site } from "@/lib/site";

const facts = [
  { label: "date", value: "wednesday, july 29, 2026" },
  { label: "venue", value: "microsoft garage · nyc" },
  { label: "format", value: "one day · invite-only" },
  { label: "hardware", value: "pasqal analog rydberg processor" },
  { label: "access", value: "pasqal cloud · pulse level" },
  { label: "admission", value: "teams by selection" },
];

const gets = [
  "Direct access to Pasqal Cloud",
  "Harmoniqs' toolkit for pulse-level optimization, with engineering support throughout the event",
  "State-of-the-art emulators and QPUs",
  "Challenges designed to produce results relevant to both companies' technical roadmaps",
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
        <p className="readout mb-4 text-brand">what participants get</p>
        <ul className="grid gap-6 md:grid-cols-2">
          {gets.map((item) => (
            <li key={item} className="card-pixel p-6 text-sm leading-relaxed text-fg">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="apply" className="border-t-2 border-line/70 bg-panel/30">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <p className="readout mb-4 text-brand">apply</p>
          <h2 className="pixel-h text-balance text-4xl sm:text-5xl">
            Applications are open now.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">
            Spots are limited. Teams are admitted by selection — graduate
            researchers and full-time scientists from the tristate quantum
            community.
          </p>
          <div className="mt-10">
            <LumaEmbed />
          </div>
        </div>
      </section>

      <section aria-label="Hosts" className="border-t-2 border-line/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
          <p className="text-sm leading-relaxed text-fg-muted">
            <span className="text-fg">Harmoniqs</span> builds quantum optimal
            control software. Our advanced toolkit enables high-fidelity gate
            synthesis and pulse-level optimization across all qubit platforms —
            validated on neutral atoms, transmons, and trapped ions.
          </p>
          <p className="text-sm leading-relaxed text-fg-muted">
            <span className="text-fg">Pasqal</span> builds analog quantum
            processors based on arrays of neutral atoms.
          </p>
        </div>
      </section>
    </>
  );
}
