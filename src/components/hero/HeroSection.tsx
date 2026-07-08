"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { STAGE_COPY, window01 } from "./stages";
import StaticHero from "./StaticHero";

const QecCanvas = dynamic(() => import("./QecCanvas"), { ssr: false });

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function HeroSection() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      progressRef.current = p;

      STAGE_COPY.forEach((stage, i) => {
        const node = captionRefs.current[i];
        if (!node) return;
        const o = window01(p, stage.start, stage.end, 0.035);
        node.style.opacity = o.toFixed(3);
        node.style.transform = `translateY(${(1 - o) * 14}px)`;
        node.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - p * 30));
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  if (reducedMotion) return <StaticHero />;

  return (
    <div ref={sectionRef} className="relative h-[550dvh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <QecCanvas progressRef={progressRef} />
        </div>

        {/* stage captions — real DOM so the story reads linearly for screen readers */}
        {STAGE_COPY.map((stage, i) => {
          const isTitle = stage.key === "title";
          const isCta = stage.key === "cta";
          return (
            <div
              key={stage.key}
              ref={(node) => {
                captionRefs.current[i] = node;
              }}
              style={{ opacity: i === 0 ? 1 : 0 }}
              className={
                isTitle || isCta
                  ? "absolute inset-x-0 top-[14dvh] z-10 mx-auto max-w-3xl px-6 text-center"
                  : "absolute bottom-[9dvh] left-4 z-10 max-w-md px-2 sm:left-[8vw]"
              }
            >
              <p className={`readout mb-4 ${isCta ? "text-brand" : "text-fg-muted"}`}>
                {stage.kicker}
              </p>
              <h2
                className={
                  isTitle
                    ? "pixel-h text-balance text-6xl sm:text-8xl"
                    : "pixel-h text-balance text-4xl sm:text-6xl"
                }
              >
                {stage.heading}
                {isTitle && (
                  <span aria-hidden="true" className="blink text-brand">
                    _
                  </span>
                )}
              </h2>
              {stage.body && (
                <p className="mt-4 text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                  {stage.body}
                </p>
              )}
              {isCta && (
                <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
                  <Link href="/#register" className="btn-pixel">
                    register
                  </Link>
                  <Link href="/challenges" className="btn-ghost">
                    the challenges
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        <p
          ref={hintRef}
          aria-hidden="true"
          className="readout absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-fg-muted"
        >
          <span className="blink">▼</span> scroll
        </p>
      </div>
    </div>
  );
}
