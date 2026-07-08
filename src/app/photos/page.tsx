import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "photos",
  description: `Photos from ${site.title} land here after ${site.eventDateHuman}.`,
};

const frames = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1).padStart(2, "0"),
}));

export default function PhotosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6">
      <p className="readout mb-4 text-brand">photos</p>
      <h1 className="pixel-h text-balance text-5xl sm:text-7xl">
        Developing after july 29.
      </h1>

      <ul
        className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3"
        aria-label="Photo placeholders"
      >
        {frames.map(({ id }, i) => (
          <li key={id} className="card-pixel relative aspect-[4/3] overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.08),transparent_65%)]"
            />
            {i === 4 && (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center gap-2"
              >
                <i className="size-2 bg-atom/70 inline-block" />
                <i className="size-2 bg-atom/70 inline-block" />
                <i className="size-2 bg-brand/80 inline-block" />
                <i className="size-2 bg-atom/70 inline-block" />
                <i className="size-2 bg-atom/70 inline-block" />
              </div>
            )}
            <span className="readout absolute bottom-2 left-3 text-fg-muted/60">
              frame {id}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
