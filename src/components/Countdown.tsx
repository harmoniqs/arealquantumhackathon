"use client";

import { useEffect, useState } from "react";

function remaining(target: number) {
  const d = Math.max(0, target - Date.now());
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor(d / 3_600_000) % 24,
    minutes: Math.floor(d / 60_000) % 60,
    seconds: Math.floor(d / 1000) % 60,
    done: d === 0,
  };
}

export default function Countdown({
  target,
  doneLabel,
}: {
  target: string;
  doneLabel: string;
}) {
  const targetMs = new Date(target).getTime();
  // null until mounted — avoids SSR/client hydration drift on the clock
  const [time, setTime] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    const tick = () => setTime(remaining(targetMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (time?.done) {
    return <p className="readout text-ok">{doneLabel}</p>;
  }

  const cells = [
    { value: time?.days, unit: "days" },
    { value: time?.hours, unit: "hrs" },
    { value: time?.minutes, unit: "min" },
    { value: time?.seconds, unit: "sec" },
  ];

  return (
    <div
      className="flex gap-4 sm:gap-5"
      role="timer"
      aria-label="Time until challenges unlock"
    >
      {cells.map(({ value, unit }) => (
        <div
          key={unit}
          className="card-pixel min-w-[4.5rem] px-3 py-3 text-center"
        >
          <div className="font-mono text-4xl tabular-nums text-brand sm:text-5xl">
            {value === undefined ? "--" : String(value).padStart(2, "0")}
          </div>
          <div className="readout mt-1 text-fg-muted">{unit}</div>
        </div>
      ))}
    </div>
  );
}
