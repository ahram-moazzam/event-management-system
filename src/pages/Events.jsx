import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryChips from "../components/CategoryChips";
import ErrorMessage from "../components/ErrorMessage";
import EventCard from "../components/EventCard";
import FilterPanel from "../components/FilterPanel";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { fetchCategories, fetchEvents } from "../features/events/eventsSlice";

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error, filters, page, categories } = useSelector((s) => s.events);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch, filters, page.number]);

  return (
    <section>
      <div className="page-head">
        <h1>Upcoming events</h1>
        {status === "succeeded" && <p className="muted">{page.totalElements.toLocaleString()} events found</p>}
      </div>
      <SearchBar />
      <CategoryChips />
      <FilterPanel />

      {status === "loading" && <Loader label="Finding events…" />}
      {status === "failed" && <ErrorMessage message={error} onRetry={() => dispatch(fetchEvents())} />}
      {status === "succeeded" && list.length === 0 && (
        <div className="empty">
          <h2>No events match these filters</h2>
          <p className="muted">Try a different keyword, widen the date range, or clear your filters.</p>
        </div>
      )}
      {status !== "failed" && list.length > 0 && (
        <div className={`grid ${status === "loading" ? "is-stale" : ""}`}>
          {list.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
      <Pagination />
    </section>
  );
}
