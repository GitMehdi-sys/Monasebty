import express from "express";

const router = express.Router();

const photos = {
  venue: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  makeup: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80",
  henna: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  dress: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80",
  car: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  card: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
};

const services = [
  ["demo-venue", "The Garden Marquee", "Wedding Venues", "Lahore", 85000, 15, "venue"],
  ["demo-photo", "Golden Hour Studios", "Photographers", "Karachi", 30000, 10, "photo"],
  ["demo-makeup", "Noor Bridal Studio", "Bridal Makeup", "Islamabad", 18000, 0, "makeup"],
  ["demo-henna", "Mehndi by Ayesha", "Henna Artists", "Lahore", 12000, 20, "henna"],
  ["demo-dress", "Sapphire Bridal Wear", "Bridal Wear", "Karachi", 45000, 0, "dress"],
  ["demo-car", "Classic Wedding Rides", "Car Rental", "Islamabad", 25000, 5, "car"],
].map(([id, title, category, city, price, discount, image]) => ({
  id, type: "service", title, category, city, price, discount: discount ? `${discount}% Off` : null,
  image: photos[image], rating: 4.6, reviewCount: 18, refundPolicy: "Partially Refundable",
}));

const cards = [
  { id: "demo-card-editable", type: "card", title: "Floral Editable Invitation", city: "Lahore", price: 180, image: photos.card, rating: 4.8, reviewCount: 11, category: "Wedding Cards", refundPolicy: "Not specified" },
  { id: "demo-card-static", type: "card", title: "Classic Gold Invitation", city: "Karachi", price: 220, image: photos.card, rating: 4.7, reviewCount: 8, category: "Wedding Cards", refundPolicy: "Not specified" },
];

const paginate = (items, query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  return { data: items.slice((page - 1) * limit, page * limit), pagination: { total: items.length, page, pages: Math.max(Math.ceil(items.length / limit), 1) } };
};
const byFilters = (items, query) => items.filter((item) => {
  if (query.city && !query.city.split(",").includes(item.city)) return false;
  if (query.budgetMin && item.price < Number(query.budgetMin)) return false;
  if (query.budgetMax && item.price > Number(query.budgetMax)) return false;
  return true;
});
const serviceDetail = (item) => ({
  id: item.id, name: item.title, category: item.category, vendorName: "EazyWed Demo Vendor", vendorId: "demo-vendor", vendorPhone: "923001234567",
  priceRange: `${item.price}-${item.price * 2}`, description: `A sample ${item.category.toLowerCase()} listing for exploring EazyWed locally.`,
  additionalInfo: "Demo content only — no real booking will be created.", photos: [item.image], discount: Number.parseInt(item.discount) || 0,
  availability: { working_hours: "10:00 AM - 8:00 PM", working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  pricingPackages: [{ _id: `${item.id}-standard`, name: "Standard Package", price: item.price, inclusions: "Demo package inclusions" }, { _id: `${item.id}-premium`, name: "Premium Package", price: item.price * 2, inclusions: "Extended demo package" }],
  details: { cancellation_policy: "Partially Refundable", staff: ["Female", "Male"], amenities: ["Parking", "Air conditioning"] }, city: item.city,
  avgRating: item.rating, reviewCount: item.reviewCount, reviews: [{ id: "demo-review", user: "Demo Couple", stars: 5, comment: "A sample review for previewing the interface.", createdAt: new Date().toISOString() }], isRental: ["Car Rental", "Bridal Wear"].includes(item.category), location_map: "",
});

router.get("/sliders/:category", (req, res) => {
  const { category } = req.params;
  let data = category === "Wedding Cards" ? cards : category === "Recommendations" ? services.slice(0, 4) : category === "Discounts" ? services.filter((item) => item.discount) : services.filter((item) => item.category === category);
  res.json({ data: byFilters(data, req.query) });
});
router.get("/discounts", (req, res) => res.json(paginate(byFilters(services.filter((item) => item.discount), req.query), req.query)));
router.get("/discounts/:category", (req, res) => res.json(paginate(byFilters(services.filter((item) => item.category === req.params.category && item.discount), req.query), req.query)));
router.get("/search", (req, res) => {
  const query = (req.query.query || "").toLowerCase();
  res.json(paginate(byFilters([...services, ...cards].filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(query)), req.query), req.query));
});
router.get("/services/:category", (req, res) => {
  const data = req.params.category === "all" ? [...services, ...cards] : req.params.category === "Wedding Cards" ? cards : services.filter((item) => item.category === req.params.category);
  res.json(paginate(byFilters(data, req.query), req.query));
});
router.get("/service/:id", (req, res) => {
  const item = services.find((service) => service.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Demo service not found" });
  res.json(serviceDetail(item));
});
router.post("/service/:id/availability", (req, res) => res.json({ whatsappLink: "https://wa.me/923001234567?text=Demo%20availability%20inquiry" }));
router.get("/filters", (req, res) => res.json({ data: { cities: ["Lahore", "Karachi", "Islamabad"], categories: [...new Set(services.map((item) => item.category)), "Wedding Cards"], refundPolicies: ["Partially Refundable"] } }));
router.get("/trending", (req, res) => res.json({ data: services.slice(0, 5).map(({ id, title: name, category }) => ({ id, name, category, type: "service" })) }));
router.get("/locations", (req, res) => res.json({ data: ["Lahore", "Karachi", "Islamabad"] }));
router.get("/recommendations", (req, res) => res.json({ data: byFilters(services.slice(0, 4), req.query) }));
router.get("/cards/:type", (req, res) => res.json(paginate(cards, req.query)));
router.get("/card/:id", (req, res) => {
  const card = cards.find((item) => item.id === req.params.id);
  if (!card) return res.status(404).json({ message: "Demo card not found" });
  res.json({ id: card.id, name: card.title, vendorName: "EazyWed Demo Vendor", vendorId: "demo-vendor", vendorPhone: "923001234567", pricePerCard: card.price, quantityAvailable: 500, frontImage: card.image, description: "A sample invitation for exploring the card experience.", type: card.id.includes("editable") ? "editable" : "static", format: ["Digital", "Printed"], designTime: "2 days", settings: {}, gallery: [card.image], dimensions: "5 x 7 inches", city: card.city, avgRating: card.rating, reviewCount: card.reviewCount, reviews: [] });
});
router.post("/card/:id/availability", (req, res) => res.json({ whatsappLink: "https://wa.me/923001234567?text=Demo%20card%20inquiry" }));
router.post("/contact", (req, res) => res.status(201).json({ message: "Thanks — this demo inquiry was not saved." }));
router.post("/chatbot", (req, res) => res.json({ response: "You are viewing EazyWed in demo mode. Browse categories, listings, and service details without a database." }));

export default router;
