"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/schedule", label: "schedule" },
  { href: "/challenges", label: "challenges" },
  { href: "/photos", label: "photos" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-line/70 bg-void/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link href="/" className="readout text-fg transition-colors hover:text-brand">
          <span aria-hidden="true" className="mr-2 inline-flex items-baseline gap-[3px]">
            <i className="size-[5px] bg-atom inline-block" />
            <i className="size-[5px] bg-atom inline-block" />
            <i className="size-[5px] bg-brand inline-block" />
            <i className="size-[5px] bg-atom inline-block" />
            <i className="size-[5px] bg-atom inline-block" />
          </span>
          a real quantum hackathon
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {links.map(({ href, label }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`readout hidden px-3 py-2 transition-colors sm:inline-block ${
                  active ? "text-brand" : "text-fg-muted hover:text-fg"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/#apply"
            className="readout border-2 border-brand-border bg-brand px-3 py-2 text-black transition-colors hover:bg-brand-hover"
          >
            apply
          </Link>
        </div>
      </nav>
    </header>
  );
}
