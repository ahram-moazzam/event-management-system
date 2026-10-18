import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";
import { cancelRegistration, registerForEvent, selectIsRegistered } from "../features/registrations/registrationsSlice";
import { showToast } from "../features/ui/uiSlice";
import { isUpcoming } from "../utils/format";

export default function RegisterButton({ event }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const registered = useSelector(selectIsRegistered(user?.id, event.id));

  if (!isUpcoming(event) && !registered) {
    return <button className="btn btn-primary" disabled>This event has ended</button>;
  }

  const handleRegister = () => {
    if (!user) return navigate("/login", { state: { from: location } });
    dispatch(registerForEvent({ userId: user.id, event }));
    dispatch(showToast({ message: `You’re registered for ${event.name}.` }));
  };

  const handleCancel = () => {
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }));
    dispatch(showToast({ message: "Registration cancelled.", type: "info" }));
  };

  if (registered) {
    return (
      <div className="register-row">
        <span className="badge badge-ok">You’re registered</span>
        {isUpcoming(event) && <button className="btn btn-danger" onClick={handleCancel}>Cancel registration</button>}
      </div>
    );
  }
  return <button className="btn btn-primary" onClick={handleRegister}>{user ? "Register for this event" : "Log in to register"}</button>;
}
