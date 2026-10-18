import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../features/events/eventsSlice";
import useDebounce from "../hooks/useDebounce";

export default function SearchBar() {
  const dispatch = useDispatch();
  const keyword = useSelector((s) => s.events.filters.keyword);
  const [text, setText] = useState(keyword);
  const debounced = useDebounce(text, 450); // keeps us under the 2 requests/second limit

  useEffect(() => {
    if (debounced !== keyword) dispatch(setFilters({ keyword: debounced }));
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setText(keyword); }, [keyword]);

  return (
    <input
      type="search"
      className="input"
      placeholder="Search artists, teams, shows…"
      aria-label="Search events"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
