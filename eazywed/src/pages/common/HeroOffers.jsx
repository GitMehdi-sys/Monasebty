import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiPause,
  FiPlay,
  FiArrowUpRight,
} from "react-icons/fi";
import "./HeroOffers.css";
const slides = [
  {
    id: "laayoune-taj-el-aarouss",
    category: "Wedding venue enquiry",
    heading: "A place for your next chapter.",
    business: "Salle Taj El Aarouss",
    copy: "Explore a Laayoune business publicly listed for wedding and celebration organisation.",
    image: "/images/moroccan-wedding.jpg",
    source:
      "https://www.la-perle-events.com/en/portfolio/a-timeless-multicultural-wedding-at-palais-namaskar-marrakech",
    credit: "Marrakech wedding · La Perle Events",
    position: "50% 22%",
    path: "/services/Wedding%20Venues/laayoune-taj-el-aarouss",
  },
  {
    id: "laayoune-machawi-dajaj",
    category: "Catering enquiry",
    heading: "Bring everyone to the table.",
    business: "Machawi Dajaj",
    copy: "Discover publicly listed occasion catering and event services in Laayoune.",
    image: "/images/marrakech-riad.jpg",
    source: "https://www.riad-vendome-marrakech.com/en/wedding-marrakech.php",
    credit: "Riad inspiration · Riad Vendôme, Marrakech",
    position: "center",
    path: "/services/Catering/laayoune-machawi-dajaj",
  },
  {
    id: "laayoune-photo-chabab",
    category: "Photography enquiry",
    heading: "Keep the moments that matter.",
    business: "Labo Photo Chabab",
    copy: "Find local photography contact details. Ask directly about wedding coverage and packages.",
    image: "/images/moroccan-caftan-wedding.jpg",
    source: "https://www.roadtobeauty.co.nz/blog/moroccanwedding-marrakech",
    credit: "Marrakech wedding · Alami Photography / Road to Beauty",
    position: "50% 30%",
    path: "/services/Photographers/laayoune-photo-chabab",
  },
];
export default function HeroOffers() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (media.matches) setPaused(true);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (paused || hover || focused || hidden) return;
    const timer = window.setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [paused, hover, focused, hidden]);
  const move = (next) => {
    setPaused(true);
    setActive((next + slides.length) % slides.length);
  };
  return (
    <section
      className="ew-offers"
      role="region"
      aria-roledescription="carousel"
      aria-label="Laayoune vendor highlights and quote enquiries"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="ew-offers-stage" aria-live={paused ? "polite" : "off"}>
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            aria-hidden={index !== active}
            className={`ew-offer ${index === active ? "is-active" : ""}`}
            inert={index !== active ? true : undefined}
          >
            <img
              src={slide.image}
              alt=""
              width="1000"
              height="900"
              fetchPriority={index === 0 ? "high" : "auto"}
              style={{ objectPosition: slide.position }}
            />
            <div className="ew-offer-shade" />
            <div className="ew-offer-content">
              <span className="ew-offer-kicker">
                {slide.category} · Laayoune
              </span>
              <h2>{slide.heading}</h2>
              <p>{slide.business}</p>
              <span className="ew-offer-description">{slide.copy}</span>
              <Link to={slide.path} className="ew-offer-cta">
                Explore this service <FiArrowUpRight />
              </Link>
              <small>
                Quote on request · Prices & dates confirmed by the business
              </small>
            </div>
            <a
              className="ew-offer-credit"
              href={slide.source}
              target="_blank"
              rel="noreferrer"
            >
              Illustrative photo: {slide.credit} ↗
            </a>
          </article>
        ))}
      </div>
      <div className="ew-offer-controls">
        <span className="ew-offer-caption">
          Local services. Your next possibility.
        </span>
        <div className="ew-offer-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${slide.business} banner`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => move(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="ew-offer-arrows">
          <button
            type="button"
            aria-label="Previous offer banner"
            onClick={() => move(active - 1)}
          >
            <FiArrowLeft />
          </button>
          <button
            type="button"
            aria-label={paused ? "Play offer banners" : "Pause offer banners"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <FiPlay /> : <FiPause />}
          </button>
          <button
            type="button"
            aria-label="Next offer banner"
            onClick={() => move(active + 1)}
          >
            <FiArrowRight />
          </button>
        </div>
      </div>
      <p className="ew-offer-disclaimer">
        Business highlights, not confirmed discounts. Photos are Moroccan
        wedding inspiration, not photos of these businesses.
      </p>
    </section>
  );
}
