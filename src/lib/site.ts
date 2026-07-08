export const site = {
  title: "a real quantum hackathon",
  description:
    "Pulse-level access, analog hardware, and open problems in Quantum Error Correction. A one-day hackathon at Microsoft Garage, New York City — Wednesday, July 29, 2026.",
  eventDate: "2026-07-29",
  eventDateHuman: "July 29, 2026",
  eventDateFull: "Wednesday, July 29, 2026",
  city: "New York City",
  venue: "Microsoft Garage, New York City",
  venueShort: "Microsoft Garage · NYC",
  luma: {
    url: "https://luma.com/jdjfnw0e",
  },
  // Challenge specs decrypt on this date; content itself ships in a separate
  // deploy that day (deploy-at-unlock — nothing secret lives in this repo).
  challengeUnlock: "2026-07-22T12:00:00-04:00",
  scheduleFinalBy: "July 22, 2026",
  host: { name: "Harmoniqs", url: "https://www.harmoniqs.ai" },
} as const;
