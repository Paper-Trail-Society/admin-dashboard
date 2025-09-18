'use client';

import { useAuthContext } from "@/lib/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  enabled?: boolean;
}

/**
 * Hook to handle client-side route protection for Bearer token authentication
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { 
    requireAuth = false, 
    redirectTo = '/login',
    enabled = true 
  } = options;
  
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || isLoading) return;

    if (requireAuth && !isAuthenticated) {
      const loginUrl = `${redirectTo}?returnTo=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, pathname, router, enabled]);

  return {
    isAuthenticated,
    isLoading,
    canAccess: !requireAuth || isAuthenticated,
  };
}

/**
 * Hook specifically for protected routes
 */
export function useRequireAuth(redirectTo?: string) {
  return useAuthGuard({ 
    requireAuth: true, 
    redirectTo: redirectTo || '/login' 
  });
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check for return URL in query params
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');
      router.push(returnTo || redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: isAuthenticated && !isLoading,
  };
}
