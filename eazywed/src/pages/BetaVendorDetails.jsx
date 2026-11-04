import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiMapPin, FiPhone, FiExternalLink, FiHeart } from "react-icons/fi";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import { useShortlist } from "./common/useShortlist";
import { findVendor } from "../data/laayoune";
import "./BetaVendorDetails.css";
export default function BetaVendorDetails() {
  const { id } = useParams();
  const vendor = findVendor(id);
  const { isSaved, toggleSaved } = useShortlist();
  useEffect(() => {
    document.title = `${vendor?.title || "Listing not found"} | EazyWed Laayoune`;
  }, [vendor]);
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-shell ew-beta-detail">
        {!vendor ? (
          <div className="ew-empty">
            <h1 className="ew-page-title">This listing isn't in our beta.</h1>
            <p>Explore our current Laayoune directory.</p>
            <Link className="ew-button" to="/services">
              Find local vendors ↗
            </Link>
          </div>
        ) : (
          <>
            <nav aria-label="Breadcrumb">
              <Link to="/">Home</Link> /{" "}
              <Link to="/services">Laayoune vendors</Link> / {vendor.title}
            </nav>
            <div className="ew-beta-detail-grid">
              <article>
                <span className="ew-eyebrow">
                  {vendor.category} · Laayoune beta
                </span>
                <h1 className="ew-page-title">{vendor.title}</h1>
                <p className="ew-beta-detail-location">
                  <FiMapPin />
                  {vendor.address ||
                    "Laayoune · Street address not published in our source"}
                </p>
                <p className="ew-beta-description">{vendor.description}</p>
                <section className="ew-beta-facts">
                  <h2>Know before you enquire.</h2>
                  <p>{vendor.confirmationNote}</p>
                  <dl>
                    <div>
                      <dt>Starting price</dt>
                      <dd>Request a quote</dd>
                    </div>
                    <div>
                      <dt>Available dates</dt>
                      <dd>Confirm directly with the business</dd>
                    </div>
                    <div>
                      <dt>Cancellation policy</dt>
                      <dd>Not published in our source</dd>
                    </div>
                    <div>
                      <dt>Business photos</dt>
                      <dd>Not supplied to EazyWed</dd>
                    </div>
                  </dl>
                </section>
                <section className="ew-beta-facts">
                  <h2>A few helpful questions.</h2>
                  <ul>
                    <li>Are you available on our wedding date?</li>
                    <li>What is included in the total price?</li>
                    <li>What deposit and cancellation terms apply?</li>
                    <li>Can we see recent work and confirm the location?</li>
                  </ul>
                </section>
              </article>
              <aside className="ew-beta-contact">
                <span className="ew-eyebrow">Your next step</span>
                <h2>Start a conversation.</h2>
                <p>
                  Bookings and quote requests happen directly with the business
                  in this beta.
                </p>
                {vendor.phone ? (
                  <a className="ew-button" href={`tel:${vendor.phone}`}>
                    <FiPhone />
                    Call {vendor.phone}
                  </a>
                ) : (
                  <p className="ew-beta-unavailable">
                    No public phone number was confirmed. Use the source listing
                    to find current contact information.
                  </p>
                )}
                <a
                  className="ew-button ew-button--outline"
                  href={vendor.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View public source <FiExternalLink />
                </a>
                <button
                  className="ew-button ew-button--outline"
                  aria-pressed={isSaved(vendor.id)}
                  onClick={() => toggleSaved(vendor)}
                >
                  <FiHeart />
                  {isSaved(vendor.id)
                    ? "Saved to your shortlist"
                    : "Save to your shortlist"}
                </button>
                <div className="ew-beta-provenance">
                  <strong>Where this information comes from</strong>
                  <a href={vendor.sourceUrl} target="_blank" rel="noreferrer">
                    {vendor.sourceName} ↗
                  </a>
                  <span>Source checked 4 November 2026.</span>
                  <p>
                    Public listing, not a confirmed EazyWed partner. Contact
                    details and services may change. We haven't contacted the
                    business or verified availability.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
