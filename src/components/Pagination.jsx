import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../features/events/eventsSlice";

export default function Pagination() {
  const dispatch = useDispatch();
  const { number, totalPages } = useSelector((s) => s.events.page);
  if (totalPages <= 1) return null;
  const go = (n) => { dispatch(setPage(n)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="pagination">
      <button className="btn btn-ghost" disabled={number === 0} onClick={() => go(number - 1)}>Previous</button>
      <span>Page {number + 1} of {totalPages}</span>
      <button className="btn btn-ghost" disabled={number >= totalPages - 1} onClick={() => go(number + 1)}>Next</button>
    </div>
  );
}
