import { Link } from "react-router-dom";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="ew-footer">
      <div className="ew-shell">
        <div className="ew-footer-main">
          <div>
            <Link className="ew-brand" to="/">
              <span className="ew-brand-mark" aria-hidden="true">
                ✳
              </span>
              Eazy<span>Wed</span>
              <span className="ew-brand-dot">.</span>
            </Link>
            <p>
              Thoughtfully planned.
              <br />
              Beautifully yours.
            </p>
          </div>
          <div className="ew-footer-links">
            <div>
              <h2>Your wedding</h2>
              <Link to="/services">Find vendors</Link>
              <Link to="/deals">Vendor offers</Link>
              <Link to="/services?saved=true">Your shortlist</Link>
            </div>
            <div>
              <h2>A little about us</h2>
              <Link to="/about">Our story</Link>
              <Link to="/contact">Get in touch</Link>
              <Link to="/vendor/category">List your business ↗</Link>
            </div>
          </div>
          <div className="ew-footer-note">
            <span className="ew-eyebrow">Made for your next chapter</span>
            <p>
              From the first idea
              <br />
              to the final detail.
            </p>
            <Link className="ew-text-link" to="/services">
              Let's find your people <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="ew-footer-bottom">
          <span>
            © {new Date().getFullYear()} EazyWed. All rights reserved.
          </span>
          <span>Made with care, for a day that matters.</span>
        </div>
        {import.meta.env.VITE_DEMO_MODE === "true" && (
          <p className="ew-footer-demo">
            Laayoune beta · Public-source listings. Shortlists stay on this
            device. No online bookings, accounts or message delivery.
          </p>
        )}
      </div>
    </footer>
  );
}
