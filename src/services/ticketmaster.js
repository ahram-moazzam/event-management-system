const BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = import.meta.env.VITE_TM_API_KEY;

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error("Missing API key. Add VITE_TM_API_KEY to your .env file and restart the dev server.");
  }
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("apikey", API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });

  const res = await fetch(url);
  if (res.status === 429) throw new Error("Too many requests. Wait a moment and try again.");
  if (res.status === 401) throw new Error("The API key was rejected. Check VITE_TM_API_KEY.");
  if (!res.ok) throw new Error(`Ticketmaster request failed (${res.status}).`);
  return res.json();
}

// The API expects UTC timestamps without milliseconds: YYYY-MM-DDTHH:mm:ssZ
const toApiDate = (d) => d.toISOString().replace(/\.\d{3}Z$/, "Z");

function pickImage(images = [], minWidth = 500) {
  const wide = images.filter((i) => i.ratio === "16_9").sort((a, b) => a.width - b.width);
  return (wide.find((i) => i.width >= minWidth) || wide[wide.length - 1] || images[0] || {}).url || null;
}

export function normalizeEvent(raw) {
  const venue = raw._embedded?.venues?.[0] || {};
  const cls = raw.classifications?.[0] || {};
  const price = raw.priceRanges?.[0];
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
    image: pickImage(raw.images),
    banner: pickImage(raw.images, 1000),
    dateTime: raw.dates?.start?.dateTime || null,
    localDate: raw.dates?.start?.localDate || null,
    localTime: raw.dates?.start?.localTime || null,
    status: raw.dates?.status?.code || null,
    venue: venue.name || "Venue to be announced",
    address: venue.address?.line1 || "",
    city: venue.city?.name || "",
    state: venue.state?.name || "",
    country: venue.country?.name || "",
    category: cls.segment?.name || "Other",
    genre: cls.genre?.name && cls.genre.name !== "Undefined" ? cls.genre.name : "",
    subGenre: cls.subGenre?.name && cls.subGenre.name !== "Undefined" ? cls.subGenre.name : "",
    priceRange: price ? { min: price.min, max: price.max, currency: price.currency } : null,
    info: raw.info || "",
    pleaseNote: raw.pleaseNote || "",
    attractions: (raw._embedded?.attractions || []).map((a) => a.name),
  };
}

export async function searchEvents({ keyword, category, city, countryCode, startDate, endDate, sort, page = 0, size = 12 }) {
  const start = startDate ? new Date(`${startDate}T00:00:00Z`) : new Date();
  const data = await request("/events.json", {
    keyword,
    classificationName: category,
    city,
    countryCode,
    startDateTime: toApiDate(start),
    endDateTime: endDate ? toApiDate(new Date(`${endDate}T23:59:59Z`)) : undefined,
    sort: sort || "date,asc",
    page,
    size,
  });
  return {
    events: (data._embedded?.events || []).map(normalizeEvent),
    // The API caps deep paging (size * page < 1000), so limit what we expose.
    totalPages: Math.min(data.page?.totalPages || 0, Math.floor(1000 / size)),
    totalElements: data.page?.totalElements || 0,
  };
}

export async function getEventById(id) {
  const raw = await request(`/events/${id}.json`);
  return normalizeEvent(raw);
}

export async function getCategories() {
  const data = await request("/classifications.json", { size: 50 });
  const seen = new Map();
  (data._embedded?.classifications || []).forEach((c) => {
    if (c.segment && c.segment.name !== "Undefined") seen.set(c.segment.id, c.segment.name);
  });
  return [...seen.values()];
}
