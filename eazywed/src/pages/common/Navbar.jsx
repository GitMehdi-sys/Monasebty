import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiHeart,
  FiArrowUpRight,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useEstimate } from "../../context/EstimateContext";
import "./Navbar.css";
const categories = ["Wedding Venues", "Catering", "Photographers"];
export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useEstimate();
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const [services, setServices] = useState(false);
  const [account, setAccount] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) {
        setServices(false);
        setAccount(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const onEscape = (e) => {
    if (e.key === "Escape") {
      setServices(false);
      setAccount(false);
      setMobile(false);
      e.target.closest(".ew-nav-dropdown")?.querySelector("button")?.focus();
    }
  };
  const close = () => {
    setMobile(false);
    setServices(false);
    setAccount(false);
  };
  return (
    <>
      <a className="ew-skip" href="#main-content">
        Skip to content
      </a>
      <header className="ew-header" ref={ref} onKeyDown={onEscape}>
        <div className="ew-shell ew-nav">
          <Link
            to="/"
            className="ew-brand"
            aria-label="EazyWed home"
            onClick={close}
          >
            <span className="ew-brand-mark" aria-hidden="true">
              ✳
            </span>
            Eazy<span>Wed</span>
            <span className="ew-brand-dot">.</span>
          </Link>
          <nav
            className={`ew-nav-links ${mobile ? "is-open" : ""}`}
            id="primary-navigation"
            aria-label="Main navigation"
          >
            <div className="ew-nav-dropdown">
              <button
                type="button"
                className={
                  location.pathname.startsWith("/services") ? "is-active" : ""
                }
                aria-expanded={services}
                aria-controls="vendor-categories"
                onClick={() => {
                  setServices(!services);
                  setAccount(false);
                }}
              >
                Find vendors <FiChevronDown aria-hidden="true" />
              </button>
              {services && (
                <div className="ew-nav-popover" id="vendor-categories">
                  <span className="ew-eyebrow">For every part of your day</span>
                  <Link to="/services" onClick={close}>
                    All wedding vendors <span aria-hidden="true">↗</span>
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      onClick={close}
                      to={`/services?category=${encodeURIComponent(cat)}`}
                    >
                      {cat}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <NavLink to="/deals" onClick={close}>
              Vendor offers
            </NavLink>
            <NavLink to="/about" onClick={close}>
              Our story
            </NavLink>
            <NavLink to="/contact" onClick={close}>
              Get in touch
            </NavLink>
            <button
              type="button"
              className="ew-mobile-plan"
              onClick={() => {
                close();
                toggleSidebar();
              }}
            >
              My wedding plan
            </button>
            <Link
              className="ew-mobile-business"
              to="/vendor/category"
              onClick={close}
            >
              For wedding professionals <FiArrowUpRight />
            </Link>
          </nav>
          <div className="ew-nav-actions">
            <Link
              to="/services?saved=true"
              className="ew-nav-heart"
              aria-label="Your saved vendors"
              onClick={close}
            >
              <FiHeart />
            </Link>
            <button
              type="button"
              className="ew-plan-button"
              onClick={toggleSidebar}
            >
              My plan
            </button>
            {user ? (
              <div className="ew-nav-dropdown">
                <button
                  className="ew-account"
                  aria-expanded={account}
                  onClick={() => {
                    setAccount(!account);
                    setServices(false);
                  }}
                >
                  {user.full_name?.split(" ")[0] || "Account"}
                  <FiChevronDown />
                </button>
                {account && (
                  <div className="ew-nav-popover ew-account-popover">
                    <Link
                      to={
                        ["superadmin", "moderator"].includes(user.role)
                          ? "/admin/dashboard"
                          : user.role === "vendor"
                            ? "/vendor/dashboard"
                            : "/dashboard"
                      }
                      onClick={close}
                    >
                      Your dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        close();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="ew-signin" to="/signin" onClick={close}>
                Sign in <span aria-hidden="true">↗</span>
              </Link>
            )}
            <button
              className="ew-menu-toggle"
              type="button"
              aria-label={mobile ? "Close navigation" : "Open navigation"}
              aria-expanded={mobile}
              aria-controls="primary-navigation"
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
