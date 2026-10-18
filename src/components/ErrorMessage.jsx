export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="notice notice-error" role="alert">
      <p>{message}</p>
      {onRetry && <button className="btn btn-ghost" onClick={onRetry}>Try again</button>}
    </div>
  );
}
