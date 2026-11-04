import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiGrid, FiArrowRight, FiX } from "react-icons/fi";
import "./SearchBar.css";
const categories = ["Wedding Venues", "Catering", "Photographers"];
export default function SearchBar({ onSearch }) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("Laayoune");
  const [query, setQuery] = useState("");
  const [byName, setByName] = useState(false);
  const id = useId();
  const input = useRef(null);
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const params = {};
    if (category) params.category = category;
    if (city) params.city = city;
    if (byName && query.trim()) params.query = query.trim();
    if (onSearch) onSearch(params);
    else navigate(`/services?${new URLSearchParams(params)}`);
  };
  return (
    <div className="ew-search">
      <form className="ew-search-form" onSubmit={submit} noValidate>
        {byName ? (
          <div className="ew-search-field ew-search-name">
            <FiSearch aria-hidden="true" />
            <div>
              <label htmlFor={`${id}-query`}>Who are you looking for?</label>
              <div className="ew-search-input">
                <input
                  ref={input}
                  id={`${id}-query`}
                  placeholder="Vendor name or keyword"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear vendor search"
                    onClick={() => {
                      setQuery("");
                      input.current?.focus();
                    }}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="ew-search-field">
            <FiGrid aria-hidden="true" />
            <div>
              <label htmlFor={`${id}-category`}>I'm looking for</label>
              <select
                id={`${id}-category`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All wedding vendors</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="ew-search-field ew-search-city">
          <FiMapPin aria-hidden="true" />
          <div>
            <label htmlFor={`${id}-city`}>Where's the celebration?</label>
            <select
              id={`${id}-city`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {["Laayoune"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="ew-button ew-search-submit" type="submit">
          Find my vendors <FiArrowRight aria-hidden="true" />
        </button>
      </form>
      <div className="ew-search-helper">
        <span>Made for your kind of celebration.</span>
        <button type="button" onClick={() => setByName(!byName)}>
          {byName ? "Browse by category" : "Know a name? Search for it"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
