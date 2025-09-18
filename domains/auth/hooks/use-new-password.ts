import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { NewPasswordFormData } from "../schemas";

interface UseNewPasswordOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useNewPassword(options?: UseNewPasswordOptions) {
  return useMutation({
    mutationFn: async ({ data, token }: { data: NewPasswordFormData; token: string }) => {
      const result = await authClient.resetPassword({
        token,
        newPassword: data.password,
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
