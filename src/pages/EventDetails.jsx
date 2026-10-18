import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import RegisterButton from "../components/RegisterButton";
import { clearSelected, fetchEventDetails } from "../features/events/eventsSlice";
import { formatDate, formatTime } from "../utils/format";

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: event, detailStatus, detailError } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchEventDetails(id));
    return () => { dispatch(clearSelected()); };
  }, [dispatch, id]);

  if (detailStatus === "loading" || detailStatus === "idle") return <Loader label="Loading event…" />;
  if (detailStatus === "failed") {
    return (
      <>
        <ErrorMessage message={detailError} onRetry={() => dispatch(fetchEventDetails(id))} />
        <Link to="/events">Back to events</Link>
      </>
    );
  }

  const location = [event.address, event.city, event.state, event.country].filter(Boolean).join(", ");
  const price = event.priceRange && `${event.priceRange.currency} ${event.priceRange.min} – ${event.priceRange.max}`;
  const rows = [
    ["Date", formatDate(event)],
    ["Time", formatTime(event) || "To be announced"],
    ["Venue", event.venue],
    ["Location", location || "To be announced"],
    ["Category", [event.category, event.genre, event.subGenre].filter(Boolean).join(" / ")],
    price && ["Ticket prices", price],
    event.attractions.length > 0 && ["Featuring", event.attractions.join(", ")],
    event.status && ["Status", event.status],
  ].filter(Boolean);

  return (
    <article className="details">
      <Link to="/events" className="back">Back to events</Link>
      {event.banner && <img className="details-img" src={event.banner} alt={event.name} />}
      <h1>{event.name}</h1>
      <dl className="facts">
        {rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
      </dl>
      {event.info && <p>{event.info}</p>}
      {event.pleaseNote && <p className="notice">{event.pleaseNote}</p>}
      <div className="details-actions">
        <RegisterButton event={event} />
        {event.url && <a className="btn btn-ghost" href={event.url} target="_blank" rel="noreferrer">Buy tickets on Ticketmaster</a>}
      </div>
    </article>
  );
}
