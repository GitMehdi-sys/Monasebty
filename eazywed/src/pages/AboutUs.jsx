import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import "./AboutUs.css";
export default function AboutUs() {
  useEffect(() => {
    document.title = "Our story — Made for Moroccan weddings | EazyWed";
  }, []);
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-about ew-shell">
        <nav aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span> / Our story</span>
        </nav>
        <section className="ew-about-hero">
          <div>
            <span className="ew-eyebrow">
              A beautiful beginning, made in Laayoune
            </span>
            <h1>
              For the day.
              <br />
              For the details.
              <br />
              <em>For you.</em>
            </h1>
            <p>
              A Moroccan wedding brings people together. Planning one should
              feel that way, too.
            </p>
            <Link to="/services" className="ew-button">
              Meet your wedding vendors ↗
            </Link>
          </div>
          <figure>
            <img
              src="/images/moroccan-caftan-wedding.jpg"
              alt="Couple celebrating a traditional Moroccan wedding in Marrakech"
              width="600"
              height="800"
            />
            <figcaption>
              Marrakech wedding ·{" "}
              <a
                href="https://www.roadtobeauty.co.nz/blog/moroccanwedding-marrakech"
                target="_blank"
                rel="noreferrer"
              >
                Alami Photography via Road to Beauty ↗
              </a>
            </figcaption>
          </figure>
        </section>
        <section className="ew-about-story">
          <span className="ew-eyebrow">Why EazyWed</span>
          <h2>
            More time for the moments.
            <br />
            Less time searching for them.
          </h2>
          <p>
            From an intimate gathering to a family celebration in Laayoune,
            every couple has a different picture of their day. EazyWed puts
            wedding venues, photographers, beauty artists, caftan ateliers, and
            the finishing touches in one place.
          </p>
          <p>
            Explore the Laayoune directory by category. Keep a shortlist of the
            people whose work you love. Ask about packages and prices, and make
            each choice with a little more confidence.
          </p>
          <Link className="ew-text-link" to="/contact">
            Have a question? Let's talk ↗
          </Link>
        </section>
        <section className="ew-business">
          <div>
            <span className="ew-eyebrow">Laayoune's wedding professionals</span>
            <h2>Beautiful days start with good people.</h2>
            <p>Bring your craft to couples planning their wedding.</p>
          </div>
          <Link className="ew-button" to="/vendor/category">
            List your business ↗
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
