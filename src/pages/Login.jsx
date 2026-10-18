import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { clearAuthError, loginUser } from "../features/auth/authSlice";
import { showToast } from "../features/ui/uiSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((s) => s.auth);
  const from = location.state?.from?.pathname || "/events";

  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);

  const handleSubmit = async ({ email, password }) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      dispatch(showToast({ message: `Welcome back, ${result.payload.name}.` }));
      navigate(from, { replace: true });
    }
  };

  return <AuthForm mode="login" onSubmit={handleSubmit} loading={status === "loading"} serverError={error} />;
}
