export function eventDate(event) {
  // Prefer the venue’s local date/time so the display matches the ticket.
  const iso = event.localDate
    ? `${event.localDate}T${event.localTime || "00:00:00"}`
    : event.dateTime;
  return iso ? new Date(iso) : null;
}

export function formatDate(event) {
  const d = eventDate(event);
  if (!d) return "Date to be announced";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(event) {
  if (!event.localTime) return "";
  const d = eventDate(event);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function isUpcoming(event) {
  const d = eventDate(event);
  if (!d) return true;
  // Treat the whole event day as upcoming.
  const endOfDay = new Date(d);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay >= new Date();
}

// Passwords are hashed with SHA-256 + email salt. This is a frontend simulation only.
export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
