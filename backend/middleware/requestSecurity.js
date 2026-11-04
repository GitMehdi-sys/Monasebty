const DANGEROUS_KEY = /(^\$|\.)/;

// MongoDB operators and dotted paths must never originate in an HTTP request.
// Controllers build the operators they need themselves from validated primitives.
export const hasDangerousKey = (value) => {
  if (!value || typeof value !== "object") return false;

  return Object.entries(value).some(([key, child]) =>
    DANGEROUS_KEY.test(key) || hasDangerousKey(child),
  );
};

export const rejectMongoOperators = (req, res, next) => {
  if (
    hasDangerousKey(req.body) ||
    hasDangerousKey(req.query) ||
    hasDangerousKey(req.params)
  ) {
    return res.status(400).json({ message: "Invalid request field" });
  }
  return next();
};

export const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const boundedPositiveInt = (value, fallback, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
};
