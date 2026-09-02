import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const accountText = localStorage.getItem("Account");

  let Account = null;

  try {
    Account = accountText ? JSON.parse(accountText) : null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("Account");
    return <Navigate to="/" replace />
  }

 if (!token || !Account) {
  return <Navigate to="/" replace />;
}

  if (allowedRoles && !allowedRoles.includes(Account.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}