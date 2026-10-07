export const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image";

export const formatBytes = (n = 0) =>
  n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;

export const parseTags = (s = "") =>
  [...new Set(String(s).split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 30);
