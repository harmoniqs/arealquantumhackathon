import { site } from "@/lib/site";

export default function LumaEmbed() {
  if (!site.luma.embedEnabled) {
    return (
      <div className="card-pixel p-8 text-center">
        <a
          href={site.luma.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pixel"
        >
          apply on luma ↗
        </a>
      </div>
    );
  }

  return (
    <div className="card-pixel overflow-hidden">
      <iframe
        src={site.luma.embed}
        title="Apply — event registration"
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
          apply on luma directly
        </a>
      </p>
    </div>
  );
}
