import { BETA_MODE } from "../data/laayoune";
import { useEffect } from "react";
import EstimateSidebar from "../pages/common/EstimateSidebar";
import { Link } from "react-router-dom";
import Navbar from "../pages/common/Navbar";
import Footer from "../pages/common/Footer";
import "../pages/AboutUs.css";
export default function PreviewGateway({ children, admin = false }) {
  useEffect(() => {
    document.title = admin
      ? "Administration preview | EazyWed"
      : "Wedding business preview | EazyWed";
  }, [admin]);
  if (!BETA_MODE && import.meta.env.VITE_DEMO_MODE !== "true") return children;
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-shell ew-preview-gateway">
        <span className="ew-eyebrow">Laayoune's wedding community</span>
        <h1 className="ew-page-title">
          {admin
            ? "Your workspace, when you’re ready."
            : "Your craft. Their next chapter."}
        </h1>
        <p>
          This local preview lets you explore the wedding marketplace.{" "}
          {admin
            ? "The administration workspace"
            : "Business registration and sign-in"}{" "}
          is outside the scope of this frontend-only Laayoune beta.
        </p>
        <p>
          You can still browse public business listings, save your favourites,
          and try the planning experience.
        </p>
        <div>
          <Link className="ew-button" to="/services">
            Explore the marketplace ↗
          </Link>
          <Link className="ew-text-link" to="/">
            Back to the beginning
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
