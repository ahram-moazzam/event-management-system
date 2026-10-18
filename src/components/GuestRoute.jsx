import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

export default function GuestRoute() {
  const user = useSelector(selectUser);
  return user ? <Navigate to="/events" replace /> : <Outlet />;
}
