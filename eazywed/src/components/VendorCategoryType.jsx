import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../pages/common/Navbar";
import Footer from "../pages/common/Footer";
import EstimateSidebar from "../pages/common/EstimateSidebar";
const categories = [
  ["wedding-venues", "Wedding venues"],
  ["photographers", "Photography"],
  ["bridal-makeup", "Bridal beauty"],
  ["henna-artists", "Henna artistry"],
  ["bridal-wear", "Caftans & bridal wear"],
  ["wedding-invitations", "Invitations"],
  ["car-rental", "Wedding transport"],
];
export default function VendorCategoryType() {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "List your wedding business | EazyWed Morocco";
  }, []);
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-vendor-onboard ew-shell">
        <Link className="ew-text-link" to="/">
          ← Back to exploring
        </Link>
        <span className="ew-eyebrow">For Morocco's wedding professionals</span>
        <h1 className="ew-page-title">
          Bring your craft
          <br />
          to their <em>beautiful day.</em>
        </h1>
        <p>Tell us what you do. We'll help you take the next step.</p>
        <fieldset>
          <legend>What is your line of business?</legend>
          <div className="ew-onboard-options">
            {categories.map(([id, label]) => (
              <label key={id} className={selected === id ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="business-category"
                  value={id}
                  checked={selected === id}
                  onChange={() => setSelected(id)}
                />
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
              </label>
            ))}
          </div>
        </fieldset>
        {import.meta.env.VITE_DEMO_MODE === "true" && (
          <p className="ew-demo-note">
            Local preview: you can explore the categories. Business registration
            will be available when a database is connected.
          </p>
        )}
        <div className="ew-onboard-actions">
          <Link to="/vendor/login">Already with us? Sign in</Link>
          <button
            className="ew-button"
            disabled={!selected}
            onClick={() =>
              navigate("/vendor/signup", { state: { category: selected } })
            }
          >
            Continue ↗
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
