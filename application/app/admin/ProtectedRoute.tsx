import { Navigate, Outlet, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute() {
  const { session, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" aria-label="Loading" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-sm rounded-xl border border-white/10 bg-[rgba(10,48,131,0.28)] p-8 text-center shadow-2xl shadow-black/40">
          <h1 className="text-lg font-medium text-foreground">Access pending</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You're signed in as {session.user.email}, but your account hasn't been added as an
            admin yet. Ask a current admin to add you in Manage Admins.
          </p>
          <button
            onClick={signOut}
            className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
