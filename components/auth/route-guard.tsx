"use client";

import { useAuthContext } from "@/lib/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loader from "../ui/loader";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

// Protected routes that require authentication
const protectedRoutes = ["/"];

// Auth routes that should redirect authenticated users away
const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function RouteGuard({
  children,
  requireAuth,
  redirectTo,
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname === route);

    // Determine if auth is required
    const needsAuth = isProtectedRoute;

    if (needsAuth && !isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = `/login?returnTo=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    if (isAuthRoute && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      const returnTo = new URLSearchParams(window.location.search).get(
        "returnTo"
      );
      const redirectUrl = redirectTo || returnTo || "/";
      router.push(redirectUrl);
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, requireAuth, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />{" "}
      </div>
    );
  }

  // For protected routes, don't render until authenticated
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const needsAuth = isProtectedRoute;

  if (needsAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for easy wrapping
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string }
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard redirectTo={options?.redirectTo}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}
