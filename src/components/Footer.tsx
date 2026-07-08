import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t-2 border-line/70 bg-panel/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="readout text-fg-muted">
          {site.eventDateHuman} · {site.venueShort}
        </p>
        <p className="text-sm text-fg-muted">
          co-hosted by{" "}
          <a
            href={site.host.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg underline decoration-line underline-offset-4 hover:text-brand"
          >
            Harmoniqs
          </a>
          , Pasqal &amp; Microsoft
        </p>
      </div>
    </footer>
  );
}
