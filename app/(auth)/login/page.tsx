"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import TextField from "@/components/ui/text-field";
import { useSignIn } from "@/domains/auth/hooks/use-sign-in";
import { LoginFormData, loginSchema } from "@/domains/auth/schemas";
import { useRedirectIfAuthenticated } from "@/lib/hooks/use-auth-guard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function LoginContent() {
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();
  const { shouldRedirect, isLoading } = useRedirectIfAuthenticated();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const queryClient = useQueryClient();

  const signInMutation = useSignIn({
    onSuccess: (data) => {
      const user = data.user;
      // push the `user` object into the `user` cache in react query
      queryClient.setQueryData(["user"], user);
      router.push("/dashboard");
    },
    onError: (error) => {
      let errorMessage = error.message || "An error occurred during login";

      // Handle email verification error specifically
      if (
        error.message?.includes("verify") ||
        error.message?.includes("verification")
      ) {
        errorMessage =
          "Please verify your email address before signing in. Check your email for a verification link.";
      }

      setGeneralError(errorMessage);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setGeneralError("");
    signInMutation.mutate(data);
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="items-center justify-items-center min-h-screen">
        <main className="flex flex-col items-center justify-center py-20 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </main>
      </div>
    );
  }

  // Don't render login form if user should be redirected
  if (shouldRedirect) {
    return (
      <div className="items-center justify-items-center min-h-screen">
        <main className="flex flex-col items-center justify-center py-20 w-full">
          <div className="text-center">
            <p>Redirecting...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="items-center justify-items-center min-h-screen">
      <main className="flex flex-col items-center py-20 w-full">
        <Link href="/">
          <Image
            src="/assets/desci-ng-logo.png"
            alt="logo"
            width={100}
            height={100}
          />
        </Link>

        <section className="md:w-1/3 w-full mx-auto my-10 space-y-6 px-8">
          <Text className="text-center leading-6 text-3xl">
            Welcome to Desci NG
          </Text>

          <Text className="text-center leading-2">
            Enter your login details below
          </Text>

          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <Text className="text-red-600 text-sm">{generalError}</Text>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <TextField
                control={form.control}
                name="email"
                label="Email address"
                placeholder="Enter your email address"
                type="email"
                className="p-6 ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50"
                required
              />

              <TextField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
                className="p-6 ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50"
                required
              />

              <Button
                variant="destructive"
                className="mt-4 py-4 rounded-lg w-full"
                type="submit"
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>
          </Form>

          {/* <SocialAuth mode="signin" /> */}

          <div className="flex justify-between text-sm text-gray-600">
            <Link href="/signup" className="hover:underline">
              Create an account
            </Link>
            <Link href="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Login() {
  return <LoginContent />;
}
