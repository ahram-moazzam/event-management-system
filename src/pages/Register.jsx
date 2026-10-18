import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { clearAuthError, registerUser } from "../features/auth/authSlice";
import { showToast } from "../features/ui/uiSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);

  const handleSubmit = async ({ name, email, password }) => {
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      dispatch(showToast({ message: "Account created. You’re logged in." }));
      navigate("/events", { replace: true });
    }
  };

  return <AuthForm mode="register" onSubmit={handleSubmit} loading={status === "loading"} serverError={error} />;
}
