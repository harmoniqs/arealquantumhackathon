import HeroSection from "@/components/hero/HeroSection";
import ApplyButton from "@/components/ApplyButton";
import AmicoMark from "@/components/AmicoMark";
import { site } from "@/lib/site";

const facts = [
  { label: "date", value: "wednesday, july 29, 2026" },
  { label: "venue", value: "microsoft garage · nyc" },
  { label: "format", value: "one day · in person" },
  { label: "hardware", value: "pasqal analog rydberg processor" },
  { label: "access", value: "pasqal cloud · pulse level" },
  { label: "admission", value: "teams by selection" },
];

const gets = [
  "Direct access to Pasqal Cloud",
  "Harmoniqs' toolkit for pulse-level optimization with multi-GPU access, and engineering support throughout the event",
  "State-of-the-art emulators and real quantum hardware",
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
        <p className="readout mb-10 text-brand">what participants get</p>

        {/* the system, for screen readers */}
        <ul className="sr-only">
          {gets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {/* the system, as a pipeline */}
        <div aria-hidden="true">
          <div className="flex flex-col items-stretch gap-0 md:flex-row md:items-center">
            {/* dashed = a problem statement, not a physical system */}
            <div className="flex-1 border-2 border-dashed border-line/80 p-5">
              <p className="readout text-fg-muted">challenges</p>
              <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                shared ahead of time with selected teams
              </p>
            </div>

            <div className="flow-v mx-auto md:hidden">
              <span className="packet" />
            </div>
            <div className="flow-h hidden flex-1 md:block">
              <span className="packet" />
            </div>

            <div className="card-pixel flex-[1.3] border-brand-border bg-brand/5 p-5">
              <div className="flex items-center gap-3">
                <AmicoMark className="h-9 w-auto shrink-0 text-fg" />
                <p className="readout text-brand">harmoniqs toolkit</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-fg-muted">
                pulse-level optimization · multi-gpu access · engineering
                support throughout the event
              </p>
            </div>

            <div className="flow-v mx-auto md:hidden">
              <span className="packet" style={{ animationDelay: "0.7s" }} />
            </div>
            <div className="flow-h hidden flex-1 md:block">
              <span className="packet" style={{ animationDelay: "0.7s" }} />
            </div>

            <div className="card-pixel flex-1 border-brand-border bg-brand/5 p-5">
              <p className="readout text-brand">pasqal cloud</p>
              <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                direct access
              </p>
            </div>

            <div className="flow-v mx-auto md:hidden">
              <span className="packet" style={{ animationDelay: "1.4s" }} />
            </div>
            <div className="flow-h hidden w-10 md:block">
              <span className="packet" style={{ animationDelay: "1.4s" }} />
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div className="card-pixel p-4">
                <p className="readout text-fg-muted">emulators</p>
              </div>
              <div className="card-pixel p-4">
                <p className="readout text-fg-muted">real quantum hardware</p>
              </div>
            </div>
          </div>

          {/* closed loop: results + calibration feed back into the toolkit */}
          <div className="relative ml-[32%] mr-[5%] mt-6 hidden md:block">
            <div className="absolute -top-6 left-0 h-6 w-[2px] bg-line" />
            <div className="absolute -top-6 right-0 h-6 w-[2px] bg-line" />
            <div className="flow-h w-full">
              <span className="packet packet-rev" />
            </div>
            <p className="readout mt-3 text-center text-fg-muted">
              ◀ results · calibration
            </p>
          </div>

          {/* mobile: the loop as a label */}
          <div className="mt-4 border-2 border-dashed border-line/80 p-4 text-center md:hidden">
            <p className="readout text-fg-muted">
              ↺ results · calibration → harmoniqs toolkit
            </p>
          </div>
        </div>

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
            <ApplyButton />
          </div>
        </div>
      </section>

    </>
  );
}
