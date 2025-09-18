import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { LoginFormData } from "../schemas";

interface UseSignInOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useSignIn(options?: UseSignInOptions) {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Better-auth with JWT plugin handles all token management automatically
      return result.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
