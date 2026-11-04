import axios from "axios";
import {
  BETA_MODE,
  BETA_CITY,
  BETA_CATEGORIES,
  vendors,
  queryVendors,
  findVendor,
} from "../data/laayoune";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/public`,
  withCredentials: true,
  timeout: 15000,
});
const local = (value) => Promise.resolve(value);
export const fetchServicesByCategory = (category, params = {}) =>
  BETA_MODE
    ? local(queryVendors(category, params))
    : api.get(`/services/${category}`, { params }).then((r) => r.data);
export const searchServices = (params = {}) =>
  BETA_MODE
    ? local(queryVendors(params.category || "all", params))
    : api.get("/search", { params }).then((r) => r.data);
export const fetchServiceFilters = () =>
  BETA_MODE
    ? local({
        cities: [BETA_CITY],
        categories: BETA_CATEGORIES,
        refundPolicies: [],
      })
    : api.get("/filters").then((r) => r.data.data);
export const fetchSliders = (category, city) =>
  BETA_MODE
    ? local(queryVendors(category, { city }).data)
    : api
        .get(`/sliders/${category}`, { params: { city } })
        .then((r) => r.data.data);
export const fetchDiscountedServices = (params = {}) =>
  BETA_MODE
    ? local(queryVendors("all", { ...params, discounted: "true" }))
    : api.get("/discounts", { params }).then((r) => r.data);
export const fetchTrendingSearches = () =>
  BETA_MODE
    ? local(vendors.slice(0, 4).map((v) => ({ ...v, name: v.title })))
    : api.get("/trending").then((r) => r.data.data);
export const fetchCardsByType = (type) =>
  BETA_MODE ? local([]) : api.get(`/cards/${type}`).then((r) => r.data.data);
export const fetchServiceDetails = (id) =>
  BETA_MODE
    ? local(findVendor(id))
    : api.get(`/service/${id}`).then((r) => r.data);
export const fetchCardDetails = (id) =>
  BETA_MODE ? local(null) : api.get(`/card/${id}`).then((r) => r.data);
export const fetchCardEditDetails = (id) =>
  BETA_MODE
    ? local(null)
    : api.get(`/card/${id}/edit`).then((r) => r.data.data);
export const fetchDiscountedServicesByCategory = (category, params = {}) =>
  BETA_MODE
    ? local(queryVendors(category, { ...params, discounted: "true" }))
    : api.get(`/discounts/${category}`, { params }).then((r) => r.data);
export const checkServiceAvailability = (id, payload) =>
  BETA_MODE
    ? Promise.reject(new Error("Contact the business directly in this beta."))
    : api.post(`/service/${id}/availability`, payload).then((r) => r.data);
export const checkCardAvailability = (id, payload) =>
  BETA_MODE
    ? Promise.reject(
        new Error("Online availability is not available in this beta."),
      )
    : api.post(`/card/${id}/availability`, payload).then((r) => r.data);
export const fetchRecommendations = (city) =>
  BETA_MODE
    ? local(queryVendors("all", { city }).data.slice(0, 4))
    : api
        .get("/recommendations", { params: { city } })
        .then((r) => r.data.data);
