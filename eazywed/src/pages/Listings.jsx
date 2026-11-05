import { BETA_MODE, BETA_CATEGORIES, BETA_CITY } from "../data/laayoune";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  FiArrowRight,
  FiChevronDown,
  FiSearch,
  FiSliders,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import ServiceCard from "./common/ServiceCard";
import { useShortlist } from "./common/useShortlist";
import {
  fetchServicesByCategory,
  fetchServiceFilters,
  searchServices,
} from "../services/api";
import "./Listings.css";

const CATEGORIES = BETA_CATEGORIES;
const DEFAULT_CITIES = [BETA_CITY];
const PAGE_SIZE = 12;
const BUDGETS = [
  { value: "", label: "Any budget", min: "", max: "" },
  { value: "0:20000", label: "Up to MAD 20,000", min: "0", max: "20000" },
  {
    value: "20000:50000",
    label: "MAD 20,000 – 50,000",
    min: "20000",
    max: "50000",
  },
  {
    value: "50000:100000",
    label: "MAD 50,000 – 100,000",
    min: "50000",
    max: "100000",
  },
  { value: "100000:", label: "MAD 100,000 and above", min: "100000", max: "" },
];

const resolveCategory = (value) => {
  if (!value || value === "all") return "";
  return (
    CATEGORIES.find(
      (item) =>
        item.toLowerCase().replace(/\s+/g, "-") ===
        value.toLowerCase().replace(/\s+/g, "-"),
    ) || value
  );
};
const positiveNumber = (value) =>
  value !== null &&
  value !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0
    ? value
    : "";

export default function Listings() {
  const dealsOnly = useLocation().pathname === "/deals";
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: routeCategory } = useParams();
  const category = resolveCategory(
    searchParams.get("category") || routeCategory,
  );
  const query = searchParams.get("query") || "";
  const savedOnly = searchParams.get("saved") === "true";
  const { savedItems } = useShortlist();
  const cities = [
    ...new Set((searchParams.get("city") || "").split(",").filter(Boolean)),
  ];
  const budgetMin = positiveNumber(searchParams.get("budgetMin"));
  const budgetMax = positiveNumber(searchParams.get("budgetMax"));
  const refundPolicy = searchParams.get("refundPolicy") || "";
  const requestedSort = searchParams.get("sort") || "recommended";
  const sort = [
    "recommended",
    "name",
    "price-asc",
    "price-desc",
    "rating",
  ].includes(requestedSort)
    ? requestedSort
    : "recommended";
  const page = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);
  const [searchDraft, setSearchDraft] = useState(query);
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    cities: DEFAULT_CITIES,
    categories: CATEGORIES,
    refundPolicies: [],
  });
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const paramsRef = useRef(searchParams);
  paramsRef.current = searchParams;

  const updateParams = (changes, options = {}) => {
    const next = new URLSearchParams(paramsRef.current);
    if (routeCategory && !next.has("category"))
      next.set("category", category || "all");
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value == null || value === "recommended")
        next.delete(key);
      else next.set(key, String(value));
    });
    if (!Object.hasOwn(changes, "page")) next.delete("page");
    setSearchParams(next, options);
  };

  useEffect(() => {
    setSearchDraft(query);
  }, [query]);

  useEffect(() => {
    if (isComposing || searchDraft === query) return undefined;
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(paramsRef.current);
      const trimmed = searchDraft.trim();
      if (trimmed) next.set("query", trimmed);
      else next.delete("query");
      next.delete("page");
      setSearchParams(next, { replace: true });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchDraft, query, isComposing, setSearchParams]);

  useEffect(() => {
    let current = true;
    setFilterError(false);
    fetchServiceFilters()
      .then((data) => {
        if (!current) return;
        setFilters({
          cities: [...new Set([...DEFAULT_CITIES, ...(data.cities || [])])],
          categories: [...new Set([...CATEGORIES, ...(data.categories || [])])],
          refundPolicies: data.refundPolicies || [],
        });
      })
      .catch(() => {
        if (current) setFilterError(true);
      });
    return () => {
      current = false;
    };
  }, [retry]);

  const savedKey = savedOnly ? JSON.stringify(savedItems) : "";
  const requestKey = JSON.stringify({
    category,
    query,
    city: cities.join(","),
    budgetMin,
    budgetMax,
    refundPolicy,
    sort,
    page,
    savedOnly,
    dealsOnly,
  });
  useEffect(() => {
    let current = true;
    let timeout;
    const request = JSON.parse(requestKey);
    const params = { page: request.page, limit: PAGE_SIZE, sort: request.sort };
    ["city", "budgetMin", "budgetMax", "refundPolicy"].forEach((key) => {
      if (request[key] !== "") params[key] = request[key];
    });
    if (request.dealsOnly && !BETA_MODE) params.discounted = "true";
    if (request.query) params.query = request.query;
    if (request.category) params.category = request.category;
    setLoading(true);
    setError("");
    let load;
    if (request.savedOnly) {
      const matched = JSON.parse(savedKey).filter((item) => {
        const text =
          `${item.title || item.name || ""} ${item.category || ""} ${item.description || ""}`.toLowerCase();
        return (
          (!request.query || text.includes(request.query.toLowerCase())) &&
          (!request.category || item.category === request.category) &&
          (!request.city || request.city.split(",").includes(item.city)) &&
          (request.budgetMin === "" ||
            Number(item.price) >= Number(request.budgetMin)) &&
          (request.budgetMax === "" ||
            Number(item.price) <= Number(request.budgetMax)) &&
          (!request.refundPolicy || item.refundPolicy === request.refundPolicy)
        );
      });
      if (request.sort === "price-asc")
        matched.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      if (request.sort === "price-desc")
        matched.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      if (request.sort === "rating")
        matched.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      load = Promise.resolve({
        data: matched.slice(
          (request.page - 1) * PAGE_SIZE,
          request.page * PAGE_SIZE,
        ),
        pagination: {
          total: matched.length,
          pages: Math.ceil(matched.length / PAGE_SIZE),
        },
      });
    } else
      load = request.query
        ? searchServices(params)
        : fetchServicesByCategory(request.category || "all", params);
    const deadline = new Promise((_, reject) => {
      timeout = window.setTimeout(() => reject(new Error("timeout")), 20000);
    });
    Promise.race([load, deadline])
      .then((response) => {
        if (!current) return;
        const nextPages = Math.max(1, Number(response.pagination?.pages) || 1);
        if (request.page > nextPages) {
          const next = new URLSearchParams(paramsRef.current);
          next.set("page", String(nextPages));
          setSearchParams(next, { replace: true });
          return;
        }
        setServices(response.data || []);
        setPagination({
          total: Number(response.pagination?.total) || 0,
          pages: nextPages,
        });
      })
      .catch(() => {
        if (current)
          setError(
            "We couldn't load the vendors. Check your connection and try again.",
          );
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (current) setLoading(false);
      });
    return () => {
      current = false;
      window.clearTimeout(timeout);
    };
  }, [requestKey, savedKey, retry, setSearchParams]);

  useEffect(() => {
    document.title = `${savedOnly ? "Your shortlist" : dealsOnly ? "Wedding deals" : query ? `Results for “${query}”` : category || "Find wedding vendors"} | EazyWed`;
  }, [category, query, savedOnly, dealsOnly]);

  const budgetValue = budgetMin || budgetMax ? `${budgetMin}:${budgetMax}` : "";
  const knownBudget = BUDGETS.some((item) => item.value === budgetValue);
  const activeCount =
    cities.length +
    Number(Boolean(category)) +
    Number(Boolean(budgetValue)) +
    Number(Boolean(refundPolicy));
  const clearAll = () => {
    const next = new URLSearchParams();
    if (routeCategory) next.set("category", "all");
    if (savedOnly) next.set("saved", "true");
    setSearchDraft("");
    setSearchParams(next);
  };
  const toggleCity = (city) =>
    updateParams({
      city: (cities.includes(city)
        ? cities.filter((item) => item !== city)
        : [...cities, city]
      ).join(","),
    });
  const clearSearch = () => {
    setSearchDraft("");
    updateParams({ query: "" });
    searchRef.current?.focus();
  };
  const rangeStart = pagination.total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(
    (page - 1) * PAGE_SIZE + services.length,
    pagination.total,
  );
  const pageNumbers = Array.from(
    { length: pagination.pages },
    (_, index) => index + 1,
  ).filter(
    (number) =>
      number === 1 ||
      number === pagination.pages ||
      Math.abs(number - page) <= 1,
  );

  return (
    <div className="ew-listings-page">
      <Navbar />
      <EstimateSidebar />
      <main className="ew-listings" id="main-content">
        <header className="ew-catalog-heading">
          <nav className="ew-catalog-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">
              {savedOnly
                ? "Your shortlist"
                : dealsOnly
                  ? "Wedding deals"
                  : "Wedding vendors"}
            </span>
          </nav>
          <p className="ew-catalog-eyebrow">
            {savedOnly
              ? "THE ONES THAT FEEL LIKE YOU"
              : "GOOD PEOPLE. BEAUTIFUL CELEBRATIONS."}
          </p>
          <h1>
            {savedOnly ? (
              <>
                Your favourites, <em>all together.</em>
              </>
            ) : dealsOnly ? (
              <>
                Local possibilities. <em>Ask for a quote.</em>
              </>
            ) : query ? (
              <>
                A little closer to <em>your perfect match.</em>
              </>
            ) : category ? (
              <>
                {category}, <em>your way.</em>
              </>
            ) : (
              <>
                Your day starts with <em>the right people.</em>
              </>
            )}
          </h1>
          <p className="ew-catalog-intro">
            {savedOnly
              ? "A little collection of possibilities for your day. Saved on this device, ready when you are."
              : "Explore publicly listed Laayoune businesses. Confirm wedding services, prices and dates directly."}
          </p>
          <form
            className="ew-catalog-search"
            role="search"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (!isComposing) updateParams({ query: searchDraft.trim() });
            }}
          >
            <FiSearch aria-hidden="true" />
            <label className="ew-catalog-sr-only" htmlFor="vendor-search">
              Search wedding vendors
            </label>
            <input
              ref={searchRef}
              id="vendor-search"
              type="search"
              value={searchDraft}
              placeholder="Try a vendor name, venue, or photographer"
              onChange={(event) => setSearchDraft(event.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(event) => {
                setIsComposing(false);
                setSearchDraft(event.currentTarget.value);
              }}
            />
            {searchDraft && (
              <button
                type="button"
                className="ew-catalog-clear-search"
                onClick={clearSearch}
                aria-label="Clear vendor search"
              >
                <FiX aria-hidden="true" />
              </button>
            )}
            <button className="ew-catalog-search-submit" type="submit">
              Find vendors <FiArrowRight aria-hidden="true" />
            </button>
          </form>
        </header>

        <div className="ew-catalog-layout">
          <aside
            className="ew-catalog-filter-panel"
            aria-label="Filter vendors"
          >
            <button
              type="button"
              className="ew-catalog-filter-toggle"
              aria-expanded={mobileFiltersOpen}
              aria-controls="catalog-filters"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <FiSliders aria-hidden="true" /> Filters{" "}
              {activeCount > 0 && <span>{activeCount}</span>}
              <FiChevronDown aria-hidden="true" />
            </button>
            <div
              id="catalog-filters"
              className={`ew-catalog-filters ${mobileFiltersOpen ? "is-open" : ""}`}
            >
              <div className="ew-catalog-filter-top">
                <h2>Make it yours</h2>
                {activeCount > 0 && (
                  <button type="button" onClick={clearAll}>
                    Reset filters
                  </button>
                )}
              </div>
              <div className="ew-catalog-filter-section">
                <label htmlFor="vendor-category">Vendor category</label>
                <select
                  id="vendor-category"
                  value={category}
                  onChange={(event) =>
                    updateParams({
                      category:
                        event.target.value || (routeCategory ? "all" : ""),
                    })
                  }
                >
                  <option value="">All wedding vendors</option>
                  {filters.categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                  {category && !filters.categories.includes(category) && (
                    <option value={category}>{category}</option>
                  )}
                </select>
              </div>
              <fieldset className="ew-catalog-filter-section">
                <legend>Where's your celebration?</legend>
                {[...new Set([...filters.cities, ...cities])].map((city) => (
                  <label className="ew-catalog-checkbox" key={city}>
                    <input
                      type="checkbox"
                      checked={cities.includes(city)}
                      onChange={() => toggleCity(city)}
                    />
                    <span>{city}</span>
                  </label>
                ))}
              </fieldset>
              <div className="ew-catalog-filter-section">
                <label htmlFor="vendor-budget">Starting price</label>
                <p className="ew-catalog-field-hint">
                  Beta prices are by quote. Contact each business.
                </p>
                <select
                  id="vendor-budget"
                  disabled={BETA_MODE}
                  value={budgetValue}
                  onChange={(event) => {
                    const selected = BUDGETS.find(
                      (item) => item.value === event.target.value,
                    );
                    if (selected)
                      updateParams({
                        budgetMin: selected.min,
                        budgetMax: selected.max,
                      });
                  }}
                >
                  {BUDGETS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                  {!knownBudget && (
                    <option value={budgetValue}>Custom price range</option>
                  )}
                </select>
              </div>
              {filters.refundPolicies.length > 0 && (
                <div className="ew-catalog-filter-section">
                  <label htmlFor="vendor-refund">Cancellation policy</label>
                  <select
                    id="vendor-refund"
                    disabled={BETA_MODE}
                    value={refundPolicy}
                    onChange={(event) =>
                      updateParams({ refundPolicy: event.target.value })
                    }
                  >
                    <option value="">Any policy</option>
                    {filters.refundPolicies.map((policy) => (
                      <option value={policy} key={policy}>
                        {policy}
                      </option>
                    ))}
                    {refundPolicy &&
                      !filters.refundPolicies.includes(refundPolicy) && (
                        <option value={refundPolicy}>{refundPolicy}</option>
                      )}
                  </select>
                </div>
              )}
              {filterError && (
                <p className="ew-catalog-filter-note" role="status">
                  Some filter options are unavailable. You can still browse, or{" "}
                  <button
                    type="button"
                    onClick={() => setRetry((value) => value + 1)}
                  >
                    try again
                  </button>
                  .
                </p>
              )}
              <div className="ew-catalog-planning-note">
                <span aria-hidden="true">✧</span>
                <p>A good fit feels right.</p>
                <span>
                  Explore the packages and cancellation details before choosing
                  your vendor.
                </span>
              </div>
            </div>
          </aside>

          <section
            className="ew-catalog-results"
            aria-label="Wedding vendor results"
            aria-busy={loading}
          >
            <div className="ew-catalog-results-toolbar">
              <div
                className="ew-catalog-result-summary"
                role="status"
                aria-live="polite"
              >
                {loading ? (
                  "Finding your people…"
                ) : error ? (
                  "Vendors are temporarily unavailable"
                ) : (
                  <>
                    <strong>{pagination.total.toLocaleString("fr-MA")}</strong>{" "}
                    {pagination.total === 1 ? "vendor" : "vendors"}
                    {query
                      ? ` for “${query}”`
                      : category
                        ? ` in ${category.toLowerCase()}`
                        : " to discover"}
                    <span>
                      {pagination.total > 0
                        ? `Showing ${rangeStart}–${rangeEnd}`
                        : "A fresh search might be the one."}
                    </span>
                  </>
                )}
              </div>
              <label className="ew-catalog-sort" htmlFor="vendor-sort">
                Sort by
                <select
                  id="vendor-sort"
                  value={sort}
                  onChange={(event) =>
                    updateParams({ sort: event.target.value })
                  }
                >
                  <option value="recommended">Directory order</option>
                  <option value="name">Name: A–Z</option>
                  <option disabled={BETA_MODE} value="price-asc">
                    Price: low to high
                  </option>
                  <option disabled={BETA_MODE} value="price-desc">
                    Price: high to low
                  </option>
                  <option disabled={BETA_MODE} value="rating">
                    Top rated
                  </option>
                </select>
              </label>
            </div>
            {(activeCount > 0 || query) && (
              <div
                className="ew-catalog-active-filters"
                aria-label="Active filters"
              >
                {query && (
                  <button type="button" onClick={clearSearch}>
                    “{query}”<FiX aria-hidden="true" />
                    <span className="ew-catalog-sr-only">Remove search</span>
                  </button>
                )}
                {category && (
                  <button
                    type="button"
                    onClick={() =>
                      updateParams({ category: routeCategory ? "all" : "" })
                    }
                  >
                    {category}
                    <FiX aria-hidden="true" />
                    <span className="ew-catalog-sr-only">
                      Remove category filter
                    </span>
                  </button>
                )}
                {cities.map((city) => (
                  <button
                    type="button"
                    key={city}
                    onClick={() => toggleCity(city)}
                  >
                    {city}
                    <FiX aria-hidden="true" />
                    <span className="ew-catalog-sr-only">
                      Remove city filter
                    </span>
                  </button>
                ))}
                {budgetValue && (
                  <button
                    type="button"
                    onClick={() =>
                      updateParams({ budgetMin: "", budgetMax: "" })
                    }
                  >
                    {BUDGETS.find((item) => item.value === budgetValue)
                      ?.label || "Custom budget"}
                    <FiX aria-hidden="true" />
                    <span className="ew-catalog-sr-only">
                      Remove price filter
                    </span>
                  </button>
                )}
                {refundPolicy && (
                  <button
                    type="button"
                    onClick={() => updateParams({ refundPolicy: "" })}
                  >
                    {refundPolicy}
                    <FiX aria-hidden="true" />
                    <span className="ew-catalog-sr-only">
                      Remove policy filter
                    </span>
                  </button>
                )}
                <button
                  className="ew-catalog-clear-all"
                  type="button"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>
            )}
            {loading ? (
              <div className="ew-catalog-state">
                <span className="ew-catalog-spinner" aria-hidden="true" />
                <h2>Finding your people</h2>
                <p>Gathering the details for your celebration.</p>
              </div>
            ) : error ? (
              <div className="ew-catalog-state" role="alert">
                <FiRefreshCw
                  className="ew-catalog-state-icon"
                  aria-hidden="true"
                />
                <h2>Let's try that again.</h2>
                <p>{error}</p>
                <button
                  type="button"
                  className="ew-catalog-state-button"
                  onClick={() => setRetry((value) => value + 1)}
                >
                  Reload vendors <FiRefreshCw aria-hidden="true" />
                </button>
              </div>
            ) : services.length === 0 ? (
              <div className="ew-catalog-state">
                <FiSearch
                  className="ew-catalog-state-icon"
                  aria-hidden="true"
                />
                <h2>
                  {savedOnly && savedItems.length === 0
                    ? "Make room for your favourites."
                    : "Your next possibility is out there."}
                </h2>
                <p>
                  {savedOnly && savedItems.length === 0
                    ? "Tap the heart on any vendor to keep them here. Your shortlist is saved on this device."
                    : "We couldn't find a match for these filters. Try another city or a wider budget."}
                </p>
                {savedOnly && savedItems.length === 0 ? (
                  <Link to="/services" className="ew-catalog-state-button">
                    Explore wedding vendors <FiArrowRight aria-hidden="true" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="ew-catalog-state-button"
                    onClick={clearAll}
                  >
                    Clear filters <FiArrowRight aria-hidden="true" />
                  </button>
                )}
              </div>
            ) : (
              <div className="ew-catalog-grid">
                {services.map((service) => (
                  <ServiceCard
                    key={`${service.type}-${service.id}`}
                    service={service}
                  />
                ))}
              </div>
            )}
            {!loading && !error && pagination.pages > 1 && (
              <nav
                className="ew-catalog-pagination"
                aria-label="Vendor result pages"
              >
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => updateParams({ page: page - 1 })}
                >
                  Previous
                </button>
                <div>
                  {pageNumbers.map((number, index) => (
                    <span key={number}>
                      {index > 0 && number - pageNumbers[index - 1] > 1 && (
                        <span
                          className="ew-catalog-page-gap"
                          aria-hidden="true"
                        >
                          …
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label={`Page ${number}`}
                        aria-current={page === number ? "page" : undefined}
                        onClick={() => updateParams({ page: number })}
                      >
                        {number}
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={page === pagination.pages}
                  onClick={() => updateParams({ page: page + 1 })}
                >
                  Next
                </button>
              </nav>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
