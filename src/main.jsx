import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Phone,
  Menu,
  X,
  Droplets,
  Waves,
  Wrench,
  Mountain,
  Trees,
  Snowflake,
  CircleCheck,
  Plus,
  MapPin,
  Sun,
  ShieldCheck,
  MoveUpRight,
} from "lucide-react";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import { contact, services, waterSystems, articles } from "./content";
import WellCutaway from "./components/WellCutaway";
import ServiceFAQ from "./components/ServiceFAQ";
import { servicePresentation, waterVisuals } from "./presentation";
import "./styles.css";
import "./editorial.css";

const Landscape = lazy(() => import("./components/Landscape"));
const icons = {
  plumbing: Wrench,
  septic: Waves,
  "water-treatment": Droplets,
  wells: Droplets,
  "excavation-aggregate": Mountain,
  logging: Trees,
  "snow-removal": Snowflake,
};
const Arrow = ({ className = "" }) => (
  <ArrowUpRight
    className={className}
    size={19}
    strokeWidth={1.7}
    aria-hidden="true"
  />
);
function Button({ to, href, children, light = false, className = "" }) {
  const content = (
    <>
      {children}
      <Arrow />
    </>
  );
  return to ? (
    <Link
      className={`button ${light ? "button-light" : ""} ${className}`}
      to={to}
    >
      {content}
    </Link>
  ) : (
    <a
      className={`button ${light ? "button-light" : ""} ${className}`}
      href={href}
    >
      {content}
    </a>
  );
}
function Brand({ footer = false }) {
  if (!footer)
    return (
      <Link
        className="brand brand-original"
        to="/"
        aria-label="Williams Solutions.Pro home"
      >
        <img
          src="/images/logo.png"
          alt="Williams Solutions.Pro"
          width="286"
          height="57"
        />
      </Link>
    );
  return (
    <Link
      className="brand brand-footer"
      to="/"
      aria-label="Williams Solutions.Pro home"
    >
      <img src="/images/mark-white.png" alt="" width="48" height="48" />
      <span>
        WILLIAMS<small>SOLUTIONS.PRO</small>
      </span>
    </Link>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuButton = useRef(null);
  const serviceButton = useRef(null);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [location]);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") {
        if (open) menuButton.current?.focus();
        else if (servicesOpen) serviceButton.current?.focus();
        setOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, servicesOpen]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="utility-bar">
        <span>
          <MapPin size={12} aria-hidden="true" /> KIRKLAND LAKE TO TEMISKAMING
          SHORES
        </span>
        <a href={contact.tel}>
          LET’S TALK <span>{contact.phone}</span>
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <button
            className="menu-toggle"
            ref={menuButton}
            aria-controls="main-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-navigation"
            aria-label="Main navigation"
            className={open ? "nav nav-open" : "nav"}
          >
            <div
              className="nav-services"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setServicesOpen(false);
              }}
            >
              <button
                ref={serviceButton}
                className="nav-link"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Our services <Plus size={13} aria-hidden="true" />
              </button>
              {servicesOpen && (
                <div className="nav-dropdown" id="services-menu">
                  {services.map((s) => (
                    <Link key={s.slug} to={`/${s.slug}`}>
                      {s.shortTitle}
                      <Arrow />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/about">About Williams</Link>
            <Link to="/insights">Good to know</Link>
            <Button to="/contact" className="nav-cta">
              Let’s get to work
            </Button>
          </nav>
        </div>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-main wrap">
        <div>
          <Brand footer />
          <p>
            Water. Land. Every season.
            <br />
            Solutions built for life up north.
          </p>
          <a className="footer-phone" href={contact.tel}>
            {contact.phone} <Arrow />
          </a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div>
          <span className="footer-label">WHAT WE DO</span>
          {services.map((s) => (
            <Link to={`/${s.slug}`} key={s.slug}>
              {s.shortTitle}
            </Link>
          ))}
        </div>
        <div>
          <span className="footer-label">GOOD PEOPLE. LOCAL KNOW-HOW.</span>
          <p>
            Serving our neighbours from
            <br />
            Kirkland Lake to Temiskaming Shores,
            <br />
            Northern Ontario.
          </p>
          <Link to="/about">
            Meet Williams <Arrow />
          </Link>
          <Link to="/contact">
            Get in touch <Arrow />
          </Link>
          <Link to="/insights">
            Homeowner resources <Arrow />
          </Link>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <span>© {new Date().getFullYear()} Williams Solutions.Pro</span>
        <span>
          Made for the North.{" "}
          <a href="https://kisstech.ca" target="_blank" rel="noreferrer">
            Built by KissTech <ArrowUpRight size={12} />
          </a>
        </span>
      </div>
    </footer>
  );
}
function Reveal({ children, className = "", ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    node.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          node.classList.remove("reveal-pending");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} {...props}>
      {children}
    </div>
  );
}
function Scene({ season }) {
  return (
    <Suspense
      fallback={
        <div className="scene-loading">
          <Mountain size={100} strokeWidth={0.6} />
        </div>
      }
    >
      <Landscape season={season} />
    </Suspense>
  );
}
function Home() {
  const [season, setSeason] = useState("summer");
  return (
    <>
      <section className={`hero hero-${season}`}>
        <div className="hero-heading wrap">
          <p className="eyebrow">
            <span className="status-dot" /> NORTHERN ONTARIO. THROUGH & THROUGH.
          </p>
          <h1>
            BUILT FOR LIFE <span>UP NORTH.</span>
          </h1>
        </div>
        <div className="hero-grid wrap">
          <div className="hero-copy">
            <p className="hero-description">
              Good water. Solid ground.
              <br />
              Clear driveways.
            </p>
            <p className="hero-support">
              One local team that knows what your property needs, through every
              season.
            </p>
            <div className="hero-actions">
              <Button to="/contact">Let’s get to work</Button>
              <a className="text-link" href="#services">
                Explore our services <ArrowDown size={16} />
              </a>
            </div>
            <div className="hero-proof">
              <ShieldCheck size={20} strokeWidth={1.4} />
              <span>
                Local expertise.
                <br />
                <strong>From the ground up.</strong>
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="scene-orbit orbit-one" />
            <div className="scene-orbit orbit-two" />
            <span className="scene-cross cross-one">+</span>
            <span className="scene-cross cross-two">+</span>
            <div
              className="hero-scene"
              role="img"
              aria-label={`Interactive 3D Northern Ontario property in ${season}: a home, well, trees, water, and excavation equipment.`}
            >
              <Scene season={season} />
            </div>
            <div className="scene-label label-water">
              <span /> BELOW THE SURFACE.
              <br />
              <strong>ABOVE EXPECTATIONS.</strong>
            </div>
            <div className="scene-caption">
              <span className="scene-coordinate">47.8° N &nbsp; 79.9° W</span>
              <span>OUR HOME. OUR ELEMENT.</span>
            </div>
            <div className="season-switch" aria-label="Landscape season">
              <button
                aria-pressed={season === "summer"}
                onClick={() => setSeason("summer")}
              >
                <Sun size={15} /> Green season
              </button>
              <button
                aria-pressed={season === "winter"}
                onClick={() => setSeason("winter")}
              >
                <Snowflake size={15} /> Snow season
              </button>
            </div>
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span>YOUR HOME. YOUR LAND. YOUR LOCAL TEAM.</span>
          <a href="#services" aria-label="Scroll to our services">
            SCROLL TO EXPLORE <ArrowDown size={15} />
          </a>
        </div>
      </section>
      <div className="service-ribbon">
        <div className="wrap">
          {["WATER", "WELLS", "EARTH", "SNOW"].map((item) => (
            <span key={item}>
              <span className="ribbon-star">✳</span>
              {item}
            </span>
          ))}
        </div>
      </div>
      <section className="section wrap" id="services">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2>
              ONE TEAM.
              <br />A WORLD OF <em>SOLUTIONS.</em>
            </h2>
          </div>
          <p>
            From the water coming into your home to the ground beneath it, we
            bring the right people and equipment to the job.
          </p>
        </Reveal>
        <div className="services-grid">
          {services.map((s) => {
            const Icon = icons[s.slug];
            return (
              <Reveal key={s.slug}>
                <Link
                  className={`service-card service-card-${s.slug}`}
                  to={`/${s.slug}`}
                >
                  <div className="card-top">
                    <Icon size={29} strokeWidth={1.3} />
                  </div>
                  <h3>{s.shortTitle}</h3>
                  <p>{s.summary}</p>
                  <span className="card-bottom">
                    EXPLORE SERVICE <Arrow />
                  </span>
                </Link>
              </Reveal>
            );
          })}
          <Reveal>
            <Link className="service-card service-card-help" to="/contact">
              <span className="eyebrow">A PROJECT IN MIND?</span>
              <h3>
                Let’s figure
                <br />
                it out together.
              </h3>
              <span className="round-arrow">
                <Arrow />
              </span>
              <span className="card-bottom">TALK TO OUR TEAM</span>
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="well-feature">
        <div className="wrap feature-grid">
          <Reveal className="feature-image">
            <WellCutaway />
          </Reveal>
          <Reveal className="feature-copy">
            <p className="eyebrow">WELL SPECIALISTS</p>
            <h2>
              GOOD WATER
              <br />
              STARTS <em>DEEPER.</em>
            </h2>
            <p className="lead">
              A well is more than plumbing. It takes specialist know-how,
              certifications, and the right equipment.
            </p>
            <p>
              We’re equipped and certified to construct, maintain, repair, and
              test wells—including dug wells that many contractors don’t take
              on.
            </p>
            <div className="well-points">
              <div>
                <span className="point-dot" aria-hidden="true" />
                <p>
                  <strong>Old well. A cleaner finish.</strong>Modernize an old
                  concrete dug well with a neat 6-inch well casing.
                </p>
              </div>
              <div>
                <span className="point-dot" aria-hidden="true" />
                <p>
                  <strong>Deep pumps. Difficult locations.</strong>Pump
                  replacement without bringing in a drilling rig, even when
                  access is a challenge.
                </p>
              </div>
              <div>
                <span className="point-dot" aria-hidden="true" />
                <p>
                  <strong>Low yield? Let’s take a look.</strong>Practical help
                  understanding your well’s performance and your options.
                </p>
              </div>
            </div>
            <Button to="/wells">Go deeper into well services</Button>
          </Reveal>
        </div>
      </section>
      <section className="section field-section wrap">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">ROOTED HERE</p>
            <h2>
              REAL WORK.
              <br />
              <em>RIGHT HERE.</em>
            </h2>
          </div>
          <p>
            We live and work in the North, too. Our approach is simple:
            understand the job, bring the right tools, and take pride in the
            result.
          </p>
        </Reveal>
        <Reveal className="field-images">
          <div className="field-main">
            <img
              src="/images/excavation.webp"
              loading="lazy"
              alt="Williams excavation and aggregate equipment working on a local site"
            />
            <div>
              <span>FROM THE FIRST SCOOP</span>
              <Link to="/excavation-aggregate">
                Groundwork that gets you going. <Arrow />
              </Link>
            </div>
          </div>
          <div className="field-side">
            <img
              src="/images/septic.webp"
              loading="lazy"
              alt="A septic system installation beside a Northern Ontario home"
            />
            <div>
              <span>TO THE LAST DETAIL</span>
              <Link to="/septic">
                Built to work below the surface. <Arrow />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="winter-feature">
        <div className="wrap winter-grid">
          <Reveal>
            <p className="eyebrow">
              <Snowflake size={16} /> READY FOR WINTER
            </p>
            <h2>
              WINTER DOESN’T WAIT.
              <br />
              <em>LET’S GET AHEAD OF IT.</em>
            </h2>
            <p>
              Keep your property accessible when the snow arrives. Talk to our
              local team about snow removal for your home or business.
            </p>
            <Button to="/snow-removal">Make a plan for snow</Button>
          </Reveal>
          <div className="winter-art" aria-hidden="true">
            <Snowflake strokeWidth={0.55} />
            <div className="winter-art-label">
              <span>BUILT FOR</span>
              <strong>
                NORTHERN
                <br />
                WINTERS.
              </strong>
              <span>WILLIAMS SOLUTIONS.PRO</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <Reveal className="section-heading compact">
          <div>
            <p className="eyebrow">A LITTLE LOCAL KNOW-HOW</p>
            <h2>
              GOOD TO <em>KNOW.</em>
            </h2>
          </div>
          <Link to="/insights" className="text-link dark">
            All homeowner resources <Arrow />
          </Link>
        </Reveal>
        <div className="article-grid">
          {articles.slice(0, 3).map((a, i) => (
            <ArticleCard article={a} key={a.slug} index={i} />
          ))}
        </div>
      </section>
      <ContactBand />
    </>
  );
}
function ArticleCard({ article, index }) {
  const imgs = [
    "/images/septic.webp",
    "/images/water.webp",
    "/images/plumbing.webp",
  ];
  return (
    <Reveal>
      <Link className="article-card" to={`/insights/${article.slug}`}>
        <div className="article-image">
          <img src={imgs[index % 3]} alt="" loading="lazy" />
          <span>
            <Arrow />
          </span>
        </div>
        <p className="eyebrow">
          {["SEPTIC CARE", "WATER QUALITY", "PLUMBING KNOW-HOW"][index % 3]}
        </p>
        <h3>{article.title}</h3>
        <span className="text-link dark">
          Read the guide <Arrow />
        </span>
      </Link>
    </Reveal>
  );
}
function ContactBand() {
  return (
    <section className="contact-band">
      <div className="wrap">
        <div>
          <p className="eyebrow">THE NEXT STEP IS A CONVERSATION.</p>
          <h2>
            LET’S GET TO <em>WORK.</em>
          </h2>
        </div>
        <div>
          <Button to="/contact" light>
            Tell us what you need
          </Button>
          <a href={contact.tel}>
            <Phone size={16} /> Or call {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
function ServiceApproach({ service }) {
  const p = servicePresentation[service.slug];
  const paired = service.features.length === 4;
  return (
    <section
      className={`section wrap service-approach ${paired ? "approach-paired" : "approach-wide"}`}
    >
      <Reveal className="approach-heading">
        <div>
          <p className="eyebrow">{service.shortTitle} / HOW WE HELP</p>
          <h2>
            {p.heading[0]}
            <br />
            <em>{p.heading[1]}</em>
          </h2>
        </div>
        {!paired && <p>{p.lead}</p>}
      </Reveal>
      <div className="approach-body">
        {paired && (
          <Reveal className="approach-aside">
            <p>{p.lead}</p>
            <figure>
              <img src={p.photo} alt={p.photoAlt} loading="lazy" />
              <figcaption>{p.caption}</figcaption>
            </figure>
          </Reveal>
        )}
        <div
          className={`features-grid features-count-${service.features.length}`}
          data-feature-count={service.features.length}
        >
          {service.features.map((f) => (
            <Reveal className="feature-item" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function AssociationMembership() {
  return (
    <section
      className="association-section wrap"
      aria-labelledby="oowa-heading"
    >
      <div className="association-logo">
        <a
          href="https://www.oowa.org/"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit the Ontario Onsite Wastewater Association"
        >
          <img
            src="/images/oowa-logo.png"
            alt="OOWA — Ontario Onsite Wastewater Association"
            width="900"
            height="526"
            loading="lazy"
          />
        </a>
      </div>
      <div className="association-copy">
        <p className="eyebrow">CONNECTED TO OUR INDUSTRY</p>
        <h2 id="oowa-heading">OOWA MEMBER.</h2>
        <p>
          Ryan Williams is a member of the Ontario Onsite Wastewater
          Association, a community supporting onsite wastewater professionals,
          education and better practices across Ontario.
        </p>
      </div>
      <a
        className="text-link dark"
        href="https://www.oowa.org/"
        target="_blank"
        rel="noreferrer"
      >
        Meet the association <Arrow />
      </a>
    </section>
  );
}
function ServicePage() {
  const { slug } = useParams();
  const s = services.find((item) => item.slug === slug);
  if (!s) return <NotFound />;
  const Icon = icons[s.slug];
  return (
    <>
      <section
        className={`detail-hero editorial-hero ${s.slug === "snow-removal" ? "snow-detail" : ""}`}
      >
        <div className="wrap detail-grid">
          <div className="detail-heading">
            <Link to="/#services" className="breadcrumb">
              OUR SERVICES <ArrowRight size={12} /> {s.shortTitle}
            </Link>
            <p className="eyebrow">
              <Icon size={17} /> {s.eyebrow}
            </p>
            <h1>
              {s.title.replace(/\.$/, "")}
              <span>.</span>
            </h1>
          </div>
          <div className="detail-copy">
            <p>{s.intro}</p>
            <Button to={`/contact?service=${s.slug}`}>
              Let’s talk {s.shortTitle.toLowerCase()}
            </Button>
            <div className="detail-local">
              <MapPin size={16} />
              <span>
                Kirkland Lake to Temiskaming Shores.
                <br />
                Local knowledge. Practical solutions.
              </span>
            </div>
          </div>
          <div className="detail-image">
            {s.slug === "snow-removal" ? (
              <Scene season="winter" />
            ) : s.slug === "wells" ? (
              <WellCutaway />
            ) : (
              <img
                src={s.image}
                alt={`${s.shortTitle} — Williams Solutions.Pro`}
                fetchPriority="high"
              />
            )}
            {s.slug !== "wells" && (
              <span className="detail-image-caption">
                LOCAL KNOW-HOW. THE RIGHT EQUIPMENT.
              </span>
            )}
          </div>
        </div>
      </section>
      <ServiceApproach service={s} />
      {s.slug === "septic" && <AssociationMembership />}
      {s.slug === "water-treatment" && (
        <section className="water-systems section">
          <div className="wrap">
            <p className="eyebrow">FIND YOUR FIT</p>
            <h2>
              BETTER WATER.
              <br />
              <em>THROUGHOUT YOUR HOME.</em>
            </h2>
            <div className="system-list">
              {waterSystems.map((w) => (
                <Link key={w.slug} to={`/water-treatment/${w.slug}`}>
                  <Droplets size={23} strokeWidth={1.3} />
                  <div>
                    <h3>{w.title}</h3>
                    <p>{w.summary}</p>
                  </div>
                  <Arrow />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <ServiceFAQ service={s} />
      <RelatedServices exclude={s.slug} />
      <ContactBand />
    </>
  );
}
function RelatedServices({ exclude }) {
  return (
    <section className="related-services">
      <div className="wrap">
        <p className="eyebrow">MORE WAYS WE CAN HELP</p>
        <div>
          {services
            .filter((s) => s.slug !== exclude)
            .map((s) => (
              <Link key={s.slug} to={`/${s.slug}`}>
                {s.shortTitle}
                <Arrow />
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
function WaterPage() {
  const { slug } = useParams();
  const system = waterSystems.find((s) => s.slug === slug);
  if (!system) return <NotFound />;
  const visual = waterVisuals[slug];
  return (
    <>
      <section className="detail-hero editorial-hero water-detail">
        <div className="wrap detail-grid">
          <div className="detail-heading">
            <Link to="/water-treatment" className="breadcrumb">
              WATER TREATMENT <ArrowRight size={12} /> {system.title}
            </Link>
            <p className="eyebrow">GOOD WATER. BETTER EVERY DAY.</p>
            <h1>
              {system.title}
              <span>.</span>
            </h1>
          </div>
          <div className="detail-copy">
            <p>{system.summary}</p>
            <Button to="/contact?service=water-treatment">
              Ask about your water
            </Button>
          </div>
          <div className="detail-image">
            <img src={visual.image} alt={visual.alt} />
          </div>
        </div>
      </section>
      <section className="section wrap narrow">
        <p className="eyebrow">A SYSTEM THAT FITS YOUR WATER</p>
        <h2>
          START WITH
          <br />
          <em>UNDERSTANDING.</em>
        </h2>
        <p className="lead">
          Every water supply is different. We’ll help assess what’s in yours and
          recommend treatment suited to your home.
        </p>
        <div className="system-benefits">
          {system.features.map((f) => (
            <div key={f}>
              <CircleCheck size={21} />
              <p>{f}</p>
            </div>
          ))}
        </div>
        <Button to="/contact?service=water-treatment">
          Talk to our water treatment team
        </Button>
      </section>
      <RelatedServices exclude="water-treatment" />
      <ContactBand />
    </>
  );
}
function About() {
  return (
    <>
      <section className="about-hero">
        <div className="wrap">
          <p className="eyebrow">WILLIAMS SOLUTIONS.PRO</p>
          <h1>
            YOUR NEIGHBOURS.
            <br />
            <span>YOUR GO-TO TEAM.</span>
          </h1>
          <div className="about-intro">
            <p>
              Life up north asks a little more of a property.
              <br />
              We’re here to help you take care of it.
            </p>
            <p>
              From Kirkland Lake to Temiskaming Shores, Williams brings together
              plumbing, water treatment, well services, septic, excavation,
              aggregate, logging, and snow removal. One local team. Plenty of
              practical know-how.
            </p>
          </div>
        </div>
      </section>
      <section className="about-photo wrap">
        <img
          src="/images/excavation.webp"
          alt="Williams heavy equipment at work in Northern Ontario"
        />
        <span>ROOTED IN NORTHERN ONTARIO.</span>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HOW WE WORK</p>
            <h2>
              GOOD PEOPLE.
              <br />
              <em>SOLID WORK.</em>
            </h2>
          </div>
          <p>
            Innovative solutions. A dedicated team. Reliable service. That’s the
            promise behind the Williams name.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Start by listening.</h3>
            <p>
              We take the time to understand your property, the problem, and
              what a good outcome looks like for you.
            </p>
          </div>
          <div className="feature-item">
            <h3>Bring the right tools.</h3>
            <p>
              Specialist equipment and practical experience help us work through
              demanding jobs and difficult access.
            </p>
          </div>
          <div className="feature-item">
            <h3>Care about the details.</h3>
            <p>
              From work you can see to systems underground, we take pride in
              solutions built to serve your property.
            </p>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
function Insights() {
  return (
    <section className="section wrap insights-page">
      <p className="eyebrow">WILLIAMS FIELD NOTES</p>
      <h1>
        GOOD TO <span>KNOW.</span>
      </h1>
      <p className="lead">
        A little know-how goes a long way. Practical reading for taking care of
        your water, home, and property.
      </p>
      <div className="article-grid">
        {articles.map((a, i) => (
          <ArticleCard article={a} index={i} key={a.slug} />
        ))}
      </div>
    </section>
  );
}
function Article() {
  const { slug } = useParams();
  const a = articles.find((a) => a.slug === slug);
  if (!a) return <NotFound />;
  return (
    <>
      <article className="article-page wrap narrow">
        <Link to="/insights" className="breadcrumb dark">
          FIELD NOTES <ArrowRight size={12} /> HOMEOWNER GUIDE
        </Link>
        <h1>{a.title}</h1>
        <p className="lead">{a.intro}</p>
        {a.sections.map((s, i) => (
          <section key={i}>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
        <div className="article-end">
          <p>Have a question about your own property?</p>
          <Button to="/contact">Talk to Williams</Button>
        </div>
      </article>
      <ContactBand />
    </>
  );
}
function Contact() {
  const location = useLocation();
  const initialService =
    new URLSearchParams(location.search).get("service") || "";
  const [selected, setSelected] = useState(initialService);
  const selectedName =
    services.find((s) => s.slug === selected)?.shortTitle || "a project";
  const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent(`Website enquiry: ${selectedName}`)}`;
  return (
    <section className="contact-page wrap">
      <div>
        <p className="eyebrow">GOOD WORK STARTS HERE.</p>
        <h1>
          WHAT CAN WE
          <br />
          <span>HELP YOU WITH?</span>
        </h1>
        <p className="lead">
          Tell us a little about your property and what you need. We’ll take it
          from there.
        </p>
        <div className="contact-details">
          <a href={contact.tel}>
            <Phone size={22} />
            <span>
              <small>GIVE US A CALL</small>
              {contact.phone}
            </span>
            <Arrow />
          </a>
          <a href={`mailto:${contact.email}`}>
            <MoveUpRight size={22} />
            <span>
              <small>SEND US A NOTE</small>
              {contact.email}
            </span>
            <Arrow />
          </a>
          <div>
            <MapPin size={22} />
            <span>
              <small>OUR NECK OF THE WOODS</small>Kirkland Lake to Temiskaming
              Shores
            </span>
          </div>
        </div>
      </div>
      <div className="request-panel">
        <p className="eyebrow">LET’S GET TO WORK.</p>
        <h2>
          YOUR PROJECT.
          <br />
          <em>OUR NEXT CONVERSATION.</em>
        </h2>
        <label htmlFor="service-select">What do you need a hand with?</label>
        <select
          id="service-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.shortTitle}
            </option>
          ))}
          <option value="something-else">Something else / I’m not sure</option>
        </select>
        <Button href={emailHref}>
          Email our team{selected ? ` about ${selectedName.toLowerCase()}` : ""}
        </Button>
        <p className="request-note">
          Opens your email app. Include your location and a few details about
          the job.
        </p>
        <div className="request-divider">
          <span>OR</span>
        </div>
        <a
          className="request-jobber"
          href={contact.requestUrl}
          target="_blank"
          rel="noreferrer"
        >
          Use our online request form <Arrow />
        </a>
        <p className="request-note">
          Continue to Williams’ secure booking page to send your request online.
        </p>
      </div>
    </section>
  );
}
function NotFound() {
  return (
    <section className="section wrap not-found">
      <p className="eyebrow">A LITTLE OFF THE BEATEN PATH.</p>
      <h1>
        LET’S GET YOU
        <br />
        <span>BACK ON TRACK.</span>
      </h1>
      <p>That page isn’t here. Our team and services are.</p>
      <Button to="/">Back to home</Button>
    </section>
  );
}
function PageEffects() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      document.getElementById("main")?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
    const slug = location.pathname.split("/").filter(Boolean).at(-1);
    const item = [...services, ...waterSystems, ...articles].find(
      (x) => x.slug === slug,
    );
    const titles = {
      about: "About Williams",
      contact: "Get in touch",
      insights: "Good to know",
      "new-request": "Get in touch",
    };
    document.title =
      location.pathname === "/"
        ? "Williams Solutions.Pro — Built for life up north."
        : `${item?.title || titles[slug] || "Page not found"} | Williams Solutions.Pro`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        item?.intro ||
          item?.summary ||
          "Williams Solutions.Pro: plumbing, wells, septic, water treatment, excavation, logging, and snow removal in Northern Ontario.",
      );
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}
function LegacyArticle({ slug }) {
  const a =
    articles.find((a) =>
      a.slug.includes(slug.split("-").slice(0, 3).join("-")),
    ) || articles[0];
  return <Navigate to={`/insights/${a.slug}`} replace />;
}
function App() {
  return (
    <BrowserRouter>
      <PageEffects />
      <Header />
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/new-request" element={<Contact />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<Article />} />
          <Route path="/water-treatment/:slug" element={<WaterPage />} />
          <Route
            path="/2021/02/06/top-10-plumbing-tips-every-homeowner-should-know"
            element={
              <LegacyArticle slug="top-10-plumbing-tips-every-homeowner-should-know" />
            }
          />
          <Route
            path="/2025/04/07/the-benefits-of-uv-water-treatmenta-comprehensive-guide"
            element={
              <LegacyArticle slug="the-benefits-of-uv-water-treatment" />
            }
          />
          <Route
            path="/2025/04/07/understanding-septic-systems-a-beginners-guide"
            element={<LegacyArticle slug="understanding-septic-systems" />}
          />
          <Route path="/:slug" element={<ServicePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
