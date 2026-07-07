export const site = {
  title: "a real quantum hackathon",
  description:
    "A one-day hackathon on real neutral-atom hardware. Analog quantum error correction: five atoms, live syndromes, real pulses. July 29, 2026 — New York City.",
  eventDate: "2026-07-29",
  eventDateHuman: "July 29, 2026",
  city: "New York City",
  luma: {
    url: "https://luma.com/jdjfnw0e",
    embed: "https://lu.ma/embed/event/evt-PbZQ7fdpSI4Ka4c/simple",
    // The Luma event page currently names the partners (title, banner art,
    // venue). Embedding it would print those names on this stealth site, so
    // the embed stays OFF until the Luma copy is scrubbed or legal clears
    // co-branding — flip to true then.
    embedEnabled: false,
  },
  // Challenge specs decrypt on this date; content itself ships in a separate
  // deploy that day (deploy-at-unlock — nothing secret lives in this repo).
  challengeUnlock: "2026-07-22T12:00:00-04:00",
  scheduleFinalBy: "July 22, 2026",
  host: { name: "Harmoniqs", url: "https://www.harmoniqs.co" },
} as const;
