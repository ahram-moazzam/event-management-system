import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../utils/format";

export default function EventCard({ event }) {
  const where = [event.venue, event.city].filter(Boolean).join(", ");
  return (
    <Link to={`/events/${event.id}`} className="card event-card">
      <div className="card-media">
        {event.image ? <img src={event.image} alt="" loading="lazy" /> : <div className="img-fallback" />}
        <span className="tag">{event.category}</span>
      </div>
      <div className="card-stub">
        <h3>{event.name}</h3>
        <p className="muted">{formatDate(event)}{formatTime(event) && ` at ${formatTime(event)}`}</p>
        <p className="muted">{where}</p>
      </div>
    </Link>
  );
}
