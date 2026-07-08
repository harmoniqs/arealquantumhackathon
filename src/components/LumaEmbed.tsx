import { site } from "@/lib/site";

export default function LumaEmbed() {
  if (!site.luma.embedEnabled) {
    return (
      <div className="card-pixel p-8 text-center">
        <p className="readout mb-6 text-fg-muted">
          registration is open · approval-based
        </p>
        <a
          href={site.luma.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pixel"
        >
          request a seat ↗
        </a>
        <p className="mt-6 text-sm text-fg-muted">
          registration is handled on Luma — seats are limited
        </p>
      </div>
    );
  }

  return (
    <div className="card-pixel overflow-hidden">
      <iframe
        src={site.luma.embed}
        title="Event registration"
        className="h-[480px] w-full"
        allow="fullscreen; payment"
        loading="lazy"
      />
      <p className="border-t-2 border-line/70 px-4 py-3 text-sm text-fg-muted">
        embed not loading?{" "}
        <a
          href={site.luma.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg underline decoration-line underline-offset-4 hover:text-brand"
        >
          open the event page directly
        </a>
      </p>
    </div>
  );
}
