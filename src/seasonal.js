// Use the business's timezone even when a visitor is travelling elsewhere.
const monthFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  month: "numeric",
});

export const landscapeSeasons = ["spring", "summer", "fall", "winter"];

export function getCalendarSeason(date = new Date()) {
  const month = Number(monthFormatter.format(date));
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

export function getSeasonalPromotion(date = new Date()) {
  const month = Number(monthFormatter.format(date));
  if (month >= 9 || month <= 2) return "snow";
  if (month === 3 || month === 4) return "maintenance";
  if (month === 6 || month === 7) return "septic";
  return "wells";
}

export const seasonalPromotions = {
  snow: {
    eyebrow: "READY FOR WINTER",
    heading: ["WINTER DOESN’T WAIT.", "LET’S GET AHEAD OF IT."],
    body: "Keep your property accessible when the snow arrives. Local snow clearing, monthly plans, snow hauling, and sanding on request.",
    link: "/snow-removal",
    cta: "Snow removal & pricing",
  },
  maintenance: {
    eyebrow: "APRIL / ANNUAL WATER CARE",
    heading: ["A FRESH START.", "FOR YOUR WATER."],
    body: "Our April maintenance program takes care of the water test, equipment checks, filters and UV, plus the products and salt your system needs for the year.",
    link: "/water-treatment#annual-maintenance",
    cta: "Explore annual maintenance",
    image: "/images/treatment-installation.webp",
    alt: "Water treatment equipment installed by Williams",
  },
  septic: {
    eyebrow: "SUMMER STARTS BELOW THE SURFACE",
    heading: ["MORE SUMMER.", "FEWER SEPTIC WORRIES."],
    body: "Get your property ready for the season ahead. From system maintenance to a new installation on a challenging site, our local team is here to help.",
    link: "/septic",
    cta: "Talk septic with Williams",
    image: "/images/septic.webp",
    alt: "Williams septic installation beside a Northern Ontario home",
  },
};
