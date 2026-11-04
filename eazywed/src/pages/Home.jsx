import { createElement, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiHome,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiTruck,
} from "react-icons/fi";
import HeroOffers from "./common/HeroOffers";
import Navbar from "./common/Navbar";
import SearchBar from "./common/SearchBar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import ServiceCard from "./common/ServiceCard";
import { fetchServicesByCategory } from "../services/api";
import "./Home.css";
const categories = [
  { name: "Wedding Venues", label: "Spaces for your day", icon: FiHome },
  { name: "Catering", label: "Bring everyone together", icon: FiTruck },
  { name: "Photographers", label: "Keep your moments", icon: FiCamera },
];
export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [city, setCity] = useState("");
  useEffect(() => {
    let alive = true;
    document.title =
      "EazyWed — Your wedding, beautifully yours | Laayoune beta";
    setLoading(true);
    setError(false);
    fetchServicesByCategory("all", { limit: 24 })
      .then((res) => {
        if (alive) setData(res.data || []);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retry]);
  const visible = (
    city ? data.filter((item) => item.category === city) : data
  ).slice(0, 4);
  return (
    <div className="ew-home">
      <Navbar />
      <EstimateSidebar />
      <main id="main-content">
        <section className="ew-hero ew-shell">
          <div className="ew-hero-copy">
            <span className="ew-eyebrow ew-hero-eyebrow">
              <span /> A beautiful beginning, made in Laayoune
            </span>
            <h1>
              Your day.
              <br />
              Your people.
              <br />
              <em>Beautifully yours.</em>
            </h1>
            <p>
              Find the places, the people, and the little details that make your
              Laayoune wedding feel like you.
            </p>
            <a href="#find-vendors" className="ew-hero-link">
              Let's start your story <span aria-hidden="true">↘</span>
            </a>
            <div className="ew-hero-foot">
              <span className="ew-small-flower" aria-hidden="true">
                ✳
              </span>
              <span>
                A little less searching.
                <br />
                <strong>A little more celebrating.</strong>
              </span>
            </div>
          </div>
          <HeroOffers />
        </section>
        <div className="ew-shell ew-home-search" id="find-vendors">
          <SearchBar
            onSearch={(query) =>
              navigate(`/services?${new URLSearchParams(query)}`)
            }
          />
          <div className="ew-search-assurance">
            <span>
              <FiCheck aria-hidden="true" /> Explore at your own pace
            </span>
            <span>
              <FiCheck aria-hidden="true" /> Find publicly listed local services
            </span>
            <span>
              <FiCheck aria-hidden="true" /> Keep your favourites together
            </span>
          </div>
        </div>
        <section
          className="ew-shell ew-categories"
          aria-labelledby="category-title"
        >
          <div className="ew-section-head">
            <div>
              <span className="ew-eyebrow">The people behind your day</span>
              <h2 id="category-title">Every detail, in good hands.</h2>
            </div>
            <Link className="ew-text-link" to="/services">
              Explore all vendors <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="ew-category-grid">
            {categories.map(({ name, label, icon: Icon }) => (
              <Link
                className="ew-category"
                to={`/services?category=${encodeURIComponent(name)}`}
                key={name}
              >
                <span className="ew-category-icon">
                  {createElement(Icon, { "aria-hidden": true })}
                </span>
                <strong>
                  {name === "Wedding Cards" ? "Invitations" : name}
                </strong>
                <span>{label}</span>
                <FiArrowUpRight
                  className="ew-category-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
        <section className="ew-discover" aria-labelledby="discover-title">
          <div className="ew-shell">
            <div className="ew-section-head">
              <div>
                <span className="ew-eyebrow">Find your perfect fit</span>
                <h2 id="discover-title">Some lovely places to start.</h2>
                <p>
                  A wedding full of possibility. A shortlist full of favourites.
                </p>
              </div>
              <Link className="ew-text-link" to="/services">
                Meet the vendors <FiArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <div
              className="ew-city-tabs"
              aria-label="Filter featured vendors by category"
            >
              {["", "Wedding Venues", "Catering", "Photographers"].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={city === c}
                  className={city === c ? "is-active" : ""}
                  onClick={() => setCity(c)}
                >
                  {c || "All local vendors"}
                </button>
              ))}
            </div>
            {loading ? (
              <div
                className="ew-card-grid"
                role="status"
                aria-label="Loading wedding vendors"
              >
                {[0, 1, 2, 3].map((n) => (
                  <div className="ew-skeleton" key={n} />
                ))}
              </div>
            ) : error ? (
              <div className="ew-error" role="alert">
                <p>
                  We couldn't load the vendors. Check your connection and try
                  again.
                </p>
                <button
                  className="ew-button"
                  onClick={() => setRetry(retry + 1)}
                >
                  Try again
                </button>
              </div>
            ) : visible.length ? (
              <div className="ew-card-grid">
                {visible.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="ew-empty">
                <h3>Your search starts here.</h3>
                <p>
                  Explore all vendors to find more options for your celebration.
                </p>
                <Link className="ew-button" to={`/services?category=${city}`}>
                  Explore {city || "vendors"} <FiArrowRight />
                </Link>
              </div>
            )}
            {import.meta.env.VITE_DEMO_MODE === "true" && (
              <p className="ew-demo-note ew-demo-catalog">
                Real Laayoune businesses · Public-source beta directory. Confirm
                contact details, wedding services and prices directly. No
                invented ratings or discounts.
              </p>
            )}
          </div>
        </section>
        <section className="ew-shell ew-planning">
          <div className="ew-planning-intro">
            <span className="ew-eyebrow">Room for the joy</span>
            <h2>
              A wedding to remember.
              <br />
              <em>A simpler way to plan.</em>
            </h2>
            <p>
              Big decisions, little details, and everything in between. Take it
              one step at a time.
            </p>
            <Link to="/services" className="ew-text-link">
              Find your first vendor <FiArrowUpRight />
            </Link>
          </div>
          <div className="ew-planning-steps">
            <div>
              <span>01</span>
              <div>
                <h3>Find your people</h3>
                <p>Explore real Laayoune listings by category.</p>
              </div>
            </div>
            <div>
              <span>02</span>
              <div>
                <h3>Make it your own</h3>
                <p>
                  Save your favourites and review their public contact details.
                </p>
              </div>
            </div>
            <div>
              <span>03</span>
              <div>
                <h3>Bring your day together</h3>
                <p>
                  Contact businesses directly to ask about packages, prices and
                  dates.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="ew-shell ew-business">
          <span className="ew-business-flower" aria-hidden="true">
            ✳
          </span>
          <div>
            <span className="ew-eyebrow">For the makers of beautiful days</span>
            <h2>Your craft. Their forever.</h2>
            <p>
              Connect your wedding business with couples planning their next
              chapter.
            </p>
          </div>
          <Link to="/vendor/category" className="ew-button ew-button--outline">
            List your business <FiArrowUpRight />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
