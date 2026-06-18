import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminRoutes } from "../lib/admin-routes";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to={adminRoutes.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
