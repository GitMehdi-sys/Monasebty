import { Link } from "react-router-dom";
import { FiHeart, FiMapPin, FiArrowUpRight } from "react-icons/fi";
import { useShortlist } from "./useShortlist";
import "./ServiceCard.css";
export default function ServiceCard({ service }) {
  const { isSaved, toggleSaved } = useShortlist();
  const saved = isSaved(service.id);
  const path =
    service.type === "card"
      ? `/cards/${service.id}`
      : `/services/${encodeURIComponent(service.category)}/${service.id}`;
  return (
    <article className="ew-vendor-card">
      <div className="ew-vendor-image">
        <Link to={path} tabIndex={-1} aria-hidden="true">
          {service.image ? (
            <img
              src={service.image}
              alt=""
              loading="lazy"
              width="600"
              height="450"
            />
          ) : (
            <div className="ew-vendor-placeholder">
              <span>
                {service.title
                  .split(" ")
                  .filter((s) => s.length > 2)
                  .slice(0, 2)
                  .map((s) => s[0])
                  .join("")}
              </span>
              <small>LAAYOUNE · PUBLIC LISTING</small>
              <p>Business photos not supplied</p>
            </div>
          )}
        </Link>
        {service.discount && (
          <span className="ew-vendor-discount">{service.discount}</span>
        )}
        <button
          className={`ew-save ${saved ? "is-saved" : ""}`}
          type="button"
          aria-label={`${saved ? "Remove" : "Save"} ${service.title}${saved ? " from" : " to"} shortlist`}
          aria-pressed={saved}
          onClick={() => toggleSaved(service)}
        >
          <FiHeart aria-hidden="true" />
        </button>
      </div>
      <div className="ew-vendor-meta">
        <span>{service.category}</span>
        {Number(service.rating) > 0 && (
          <span className="ew-vendor-rating">
            ★ {service.rating} ({service.reviewCount})
          </span>
        )}
      </div>
      <h3>
        <Link to={path}>
          {service.title}
          <FiArrowUpRight aria-hidden="true" />
        </Link>
      </h3>
      <p className="ew-vendor-location">
        <FiMapPin aria-hidden="true" />
        {service.city}
      </p>
      <div className="ew-vendor-bottom">
        <span>
          {service.price != null ? (
            <>
              <span>From </span>
              <strong>
                {Number(service.price).toLocaleString("fr-MA")} MAD
              </strong>
            </>
          ) : (
            <strong>Request a quote</strong>
          )}
        </span>
        <span className="ew-card-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </article>
  );
}
