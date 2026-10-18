import { useState } from "react";
import { Link } from "react-router-dom";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(values, mode) {
  const errors = {};
  if (mode === "register" && values.name.trim().length < 2) errors.name = "Enter your name (at least 2 characters).";
  if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (mode === "register") {
    if (values.password.length < 6) errors.password = "Use at least 6 characters.";
    if (values.confirm !== values.password) errors.confirm = "Passwords don’t match.";
  } else if (!values.password) {
    errors.password = "Enter your password.";
  }
  return errors;
}

export default function AuthForm({ mode, onSubmit, loading, serverError }) {
  const isRegister = mode === "register";
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const found = validate(values, mode);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  };

  const field = (name, label, type = "text", autoComplete) => (
    <label className="field">
      {label}
      <input className={`input ${errors[name] ? "input-error" : ""}`} name={name} type={type} value={values[name]} onChange={change} autoComplete={autoComplete} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </label>
  );

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
      {serverError && <div className="notice notice-error" role="alert">{serverError}</div>}
      {isRegister && field("name", "Name", "text", "name")}
      {field("email", "Email", "email", "email")}
      {field("password", "Password", "password", isRegister ? "new-password" : "current-password")}
      {isRegister && field("confirm", "Confirm password", "password", "new-password")}
      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Please wait…" : isRegister ? "Create account" : "Log in"}
      </button>
      <p className="muted center">
        {isRegister ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
      </p>
    </form>
  );
}
