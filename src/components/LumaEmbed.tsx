import { site } from "@/lib/site";

export default function LumaEmbed() {
  if (!site.luma.embedEnabled) {
    return (
      <div className="rounded-lg border border-line bg-panel/60 p-8 text-center">
        <p className="readout mb-4 text-fg-muted">
          registration is open · approval-based
        </p>
        <a
          href={site.luma.url}
          target="_blank"
          rel="noopener noreferrer"
          className="readout inline-block rounded border border-probe bg-probe/10 px-8 py-4 text-probe transition-colors hover:bg-probe/20"
        >
          request a seat ↗
        </a>
        <p className="mt-4 text-sm text-fg-muted">
          registration is handled on Luma — seats are limited
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel/60">
      <iframe
        src={site.luma.embed}
        title="Event registration"
        className="h-[480px] w-full"
        allow="fullscreen; payment"
        loading="lazy"
      />
      <p className="border-t border-line/60 px-4 py-3 text-sm text-fg-muted">
        embed not loading?{" "}
        <a
          href={site.luma.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg underline decoration-line underline-offset-4 hover:text-probe"
        >
          open the event page directly
        </a>
      </p>
    </div>
  );
}
