import { lazy, Suspense, useId } from "react";
import { Minus, Plus } from "lucide-react";
import WellCutaway from "./WellCutaway";
import "./ServiceFAQ.css";

const Landscape = lazy(() => import("./Landscape"));

const sectionContent = {
  plumbing: {
    headline: "Let’s talk pipes, pumps & comfort.",
    intro:
      "A few practical answers before a repair, an installation or a heating upgrade.",
    caption: "Behind your everyday comfort.",
    alt: "Plumbing and mechanical pipework in a building.",
    position: "52% center",
  },
  septic: {
    headline: "Every property has its questions.",
    intro:
      "From a challenging lot to an existing system, here is where the conversation starts.",
    caption: "Good planning starts on site.",
    alt: "Septic chambers and pipework being installed in a gravel bed beside a wooded cottage.",
    position: "51% 63%",
  },
  "water-treatment": {
    headline: "Get to know your water.",
    intro:
      "Understand your source, the treatment options and what each system does.",
    caption: "Start with the source.",
    alt: "A close-up of a water droplet and circular ripples on a blue water surface.",
    position: "68% center",
  },
  wells: {
    headline: "A little clarity below the surface.",
    intro:
      "What to know about specialist well work, pump replacement and your existing water supply.",
  },
  "excavation-aggregate": {
    headline: "Before we break ground.",
    intro:
      "A few answers to help you plan the access, drainage and groundwork your property needs.",
    caption: "The groundwork comes first.",
    alt: "An excavator, aggregate screening equipment and a loader working at a gravel pit.",
    position: "35% center",
  },
  logging: {
    headline: "What comes next for your land?",
    intro:
      "Talk through the trees, the timber and the access you want to keep or create.",
    caption: "Your woodland. Your plans.",
    alt: "Stacks of harvested logs beside a snowy access road and timber buildings.",
    position: "74% center",
  },
  "snow-removal": {
    headline: "Plan ahead for winter.",
    intro:
      "Start with your address, the areas to clear and the access your property needs.",
    caption: "Let’s talk winter access.",
  },
};

export default function ServiceFAQ({ service }) {
  const headingId = useId();
  if (!service?.faqs?.length) return null;

  const content = sectionContent[service.slug] || {
    headline: `Questions about ${service.shortTitle.toLowerCase()}?`,
    intro: "Find a few answers to help you plan the work for your property.",
    caption: service.shortTitle,
    alt: `${service.shortTitle} service illustration.`,
  };
  const isWell = service.slug === "wells";
  const isWinter = service.slug === "snow-removal";

  return (
    <section
      className={`service-faq service-faq--${service.slug}`}
      aria-labelledby={headingId}
    >
      <div className="service-faq__inner">
        <figure
          className={`service-faq__visual${isWell ? " service-faq__visual--well" : ""}${isWinter ? " service-faq__visual--winter" : ""}`}
        >
          {isWell ? (
            <WellCutaway className="service-faq__well" />
          ) : isWinter ? (
            <>
              <div className="service-faq__winter">
                <Suspense
                  fallback={
                    <div
                      className="service-faq__winter-loading"
                      aria-hidden="true"
                    />
                  }
                >
                  <Landscape season="winter" />
                </Suspense>
              </div>
              <span className="service-faq__scene-label">
                A NORTHERN WINTER
              </span>
            </>
          ) : (
            <img
              src={service.image}
              alt={content.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: content.position }}
            />
          )}

          {!isWell && (
            <figcaption className="service-faq__caption">
              <span>{service.shortTitle}</span>
              <p>{content.caption}</p>
            </figcaption>
          )}
        </figure>

        <div className="service-faq__content">
          <p className="service-faq__eyebrow">A FEW GOOD QUESTIONS</p>
          <h2 id={headingId}>{content.headline}</h2>
          <p className="service-faq__intro">{content.intro}</p>

          <div className="faq-list service-faq__questions">
            {service.faqs.map((faq, index) => (
              <details
                key={`${service.slug}-${faq.question}`}
                open={index === 0}
              >
                <summary>
                  <span>{faq.question}</span>
                  <span className="service-faq__toggle" aria-hidden="true">
                    <Plus className="plus" size={18} strokeWidth={1.7} />
                    <Minus className="minus" size={18} strokeWidth={1.7} />
                  </span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
