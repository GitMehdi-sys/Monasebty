const DANGEROUS_KEY = /(^\$|\.)/;
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const getOrigin = (value) => {
  if (typeof value !== "string") return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

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

export const createSameOriginGuard = (allowedOrigins) => {
  const originAllowlist = new Set(
    (Array.isArray(allowedOrigins) ? allowedOrigins : [allowedOrigins])
      .map(getOrigin)
      .filter(Boolean),
  );

  return (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) return next();

    const hasAuthCookie = Boolean(req.cookies?.token || req.cookies?.resetToken);
    const requestOrigin = req.get("origin") || req.get("referer");

    // Non-cookie API clients are not exposed to cookie-based CSRF.
    if (!hasAuthCookie && !requestOrigin) return next();

    const parsedOrigin = getOrigin(requestOrigin);
    if (!parsedOrigin || !originAllowlist.has(parsedOrigin)) {
      return res.status(403).json({ message: "Cross-origin request blocked" });
    }

    return next();
  };
};

export const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const boundedPositiveInt = (value, fallback, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
};
