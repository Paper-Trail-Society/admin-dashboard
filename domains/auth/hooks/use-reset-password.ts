import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordFormData } from "../schemas";

interface UseResetPasswordOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useResetPassword(options?: UseResetPasswordOptions) {
  return useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      const result = await authClient.forgetPassword({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
