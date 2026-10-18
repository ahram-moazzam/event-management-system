import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../features/events/eventsSlice";

export default function CategoryChips() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.events.categories);
  const active = useSelector((s) => s.events.filters.category);
  const pick = (category) => dispatch(setFilters({ category }));

  return (
    <div className="chips" role="group" aria-label="Event categories">
      <button className={`chip ${active === "" ? "chip-on" : ""}`} onClick={() => pick("")}>All</button>
      {categories.map((c) => (
        <button key={c} className={`chip ${active === c ? "chip-on" : ""}`} onClick={() => pick(c)}>{c}</button>
      ))}
    </div>
  );
}
