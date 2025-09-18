"use client";

import { authClient } from "@/lib/auth-client";
import { createContext, ReactNode, useContext } from "react";
import { useUser } from "@/domains/auth/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";

type User = NonNullable<ReturnType<typeof authClient.useSession>['data']>['user'];

interface AuthContextType {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useUser();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await authClient.signOut();
      // clear user data in the query cache
      queryClient.setQueryData(["user"], null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("bearer_token");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force cleanup even if signOut fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("bearer_token");
      }
    }
  };

  const authValue: AuthContextType = {
    user,
    isLoading: isPending,
    isAuthenticated: !!user,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
