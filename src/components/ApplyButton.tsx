import { site } from "@/lib/site";

export default function ApplyButton() {
  return (
    <a
      href={site.luma.url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-pixel"
    >
      apply on luma ↗
    </a>
  );
}
