/* eslint-disable @next/next/no-img-element */
// Amico — renders public/amico.svg (the official yellow mark), so swapping
// that file updates the site with no code change. Plain <img> keeps the
// SVG crisp; the basePath prefix matches next.config.ts.
const BASE = process.env.NODE_ENV === "production" ? "/arealquantumhackathon" : "";

export default function AmicoMark({ className }: { className?: string }) {
  return (
    <img
      src={`${BASE}/amico.svg`}
      alt="Amico"
      className={className}
      draggable={false}
    />
  );
}
