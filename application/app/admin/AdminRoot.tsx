import { Outlet } from "react-router";
import { AuthProvider } from "./AuthProvider";
import { ToastProvider } from "./components/Toast";

export function AdminRoot() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="admin-shell min-h-screen bg-background text-foreground">
          <Outlet />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
