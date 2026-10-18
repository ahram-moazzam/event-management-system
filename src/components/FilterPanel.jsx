import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetFilters, setFilters } from "../features/events/eventsSlice";
import useDebounce from "../hooks/useDebounce";

export default function FilterPanel() {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.events.filters);
  const [city, setCity] = useState(filters.city);
  const debouncedCity = useDebounce(city, 500);

  useEffect(() => {
    if (debouncedCity !== filters.city) dispatch(setFilters({ city: debouncedCity }));
  }, [debouncedCity]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setCity(filters.city); }, [filters.city]);

  const update = (field) => (e) => dispatch(setFilters({ [field]: e.target.value }));

  return (
    <div className="filters">
      <label>City
        <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Chicago" />
      </label>
      <label>From
        <input type="date" className="input" value={filters.startDate} onChange={update("startDate")} />
      </label>
      <label>To
        <input type="date" className="input" min={filters.startDate || undefined} value={filters.endDate} onChange={update("endDate")} />
      </label>
      <label>Sort by
        <select className="input" value={filters.sort} onChange={update("sort")}>
          <option value="date,asc">Soonest first</option>
          <option value="date,desc">Latest first</option>
          <option value="name,asc">Name A–Z</option>
          <option value="relevance,desc">Most relevant</option>
        </select>
      </label>
      <button className="btn btn-ghost" onClick={() => dispatch(resetFilters())}>Clear filters</button>
    </div>
  );
}
