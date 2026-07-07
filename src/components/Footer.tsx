import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-panel/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="readout text-fg-muted">
            {site.eventDateHuman} · {site.city}
          </p>
          <p className="text-sm text-fg-muted">
            hosted by{" "}
            <a
              href={site.host.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline decoration-line underline-offset-4 hover:text-probe"
            >
              {site.host.name}
            </a>
          </p>
        </div>
        <div className="space-y-2 md:text-right">
          <p className="readout text-fg-muted">
            co-host: <span className="text-entangle">announcement in progress</span>
          </p>
          <p className="text-sm text-fg-muted">
            questions? ask on the{" "}
            <a
              href={site.luma.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline decoration-line underline-offset-4 hover:text-probe"
            >
              event page
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
