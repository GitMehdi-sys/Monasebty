import { Link } from "react-router-dom";
import { useEstimate } from "../../context/EstimateContext";
import { useAuth } from "../../context/AuthContext";
import ExperienceDialog from "./ExperienceDialog";
export default function EstimateSidebar() {
  const {
    estimateItems,
    totalCost,
    removeFromEstimate,
    clearEstimate,
    isSidebarOpen,
    toggleSidebar,
    loading,
  } = useEstimate();
  const { user } = useAuth();
  if (!isSidebarOpen) return null;
  return (
    <ExperienceDialog
      open={isSidebarOpen}
      onClose={toggleSidebar}
      title="Your wedding plan"
    >
      {!estimateItems.length ? (
        <div className="ew-estimate-empty">
          <span className="ew-eyebrow">
            A little planning, a lot of possibility
          </span>
          <p>
            Explore local businesses, save your favourites to a shortlist, and
            ask each business for a quote.
          </p>
          {!user && (
            <p>
              No account is needed in this beta. Save a shortlist in this
              browser, then contact the businesses directly.
            </p>
          )}
          <Link className="ew-button" to="/services" onClick={toggleSidebar}>
            Explore vendors <span aria-hidden="true">↗</span>
          </Link>
        </div>
      ) : (
        <>
          <div aria-busy={loading}>
            {estimateItems.map((item, index) => (
              <div
                className="ew-estimate-item"
                key={`${item.serviceId || item.cardId}-${index}`}
              >
                <div>
                  <strong>{item.name}</strong>
                  <div>
                    Quantity {item.quantity} · MAD{" "}
                    {Number(item.subtotal).toLocaleString("fr-MA")}
                  </div>
                </div>
                <button
                  disabled={loading}
                  aria-label={`Remove ${item.name}`}
                  onClick={() =>
                    removeFromEstimate(
                      item.type === "service" ? item.serviceId : item.cardId,
                      item.type,
                      item.packageId,
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="ew-estimate-total">
            <span>Estimated total</span>
            <strong>MAD {Number(totalCost).toLocaleString("fr-MA")}</strong>
          </div>
          <div className="ew-estimate-actions">
            <Link className="ew-button" to="/dashboard" onClick={toggleSidebar}>
              View your plan
            </Link>
            <button
              className="ew-button ew-button--outline"
              disabled={loading}
              onClick={clearEstimate}
            >
              Clear estimate
            </button>
          </div>
        </>
      )}
      <p className="ew-demo-note">
        Prices and dates must be confirmed directly with each business. Online
        estimates and bookings are not available in this beta.
      </p>
    </ExperienceDialog>
  );
}
