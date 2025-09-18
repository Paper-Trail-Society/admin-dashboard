import { useAuthContext } from "@/lib/contexts/auth-context";
import { useMutation } from "@tanstack/react-query";

export function useSignOut() {
  const { logout } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      await logout();
      // Context handles Bearer token cleanup
    },
  });
}
