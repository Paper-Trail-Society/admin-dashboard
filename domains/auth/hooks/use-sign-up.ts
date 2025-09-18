import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { SignupFormData } from "../schemas";

interface UseSignUpOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useSignUp(options?: UseSignUpOptions) {
  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        institutionId: data.institutionId,
        areasOfInterest: data.areasOfInterest
          ? JSON.stringify(data.areasOfInterest)
          : undefined,
        callbackURL: `${window.location.origin}/login`,
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
