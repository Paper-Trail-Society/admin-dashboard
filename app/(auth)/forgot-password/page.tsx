"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import TextField from "@/components/ui/text-field";
import { useResetPassword } from "@/domains/auth/hooks";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/domains/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      setResetEmail(form.getValues("email"));
      setSuccess(true);
    },
    onError: (error) => {
      form.setError("root", {
        message: error.message || "An error occurred while sending reset email",
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  if (success) {
    return (
      <div className="items-center justify-items-center">
        <main className="flex flex-col items-center py-20 w-full">
          <Link href="/">
            <Image
              src="/assets/desci-ng-logo.png"
              alt="logo"
              width={100}
              height={100}
            />
          </Link>

          <section className="md:w-1/3 w-full mx-auto my-10 space-y-6 px-8 text-center">
            <Text className="text-center leading-6 text-3xl">
              Check Your Email
            </Text>

            <div className="p-6 bg-green-50 border border-green-200 rounded-md">
              <Text className="text-green-800">
                We've sent a password reset link to{" "}
                <strong>{resetEmail}</strong>
              </Text>
              <Text className="text-green-700 text-sm mt-2">
                Please check your email and follow the instructions to reset
                your password.
              </Text>
            </div>

            <div className="space-y-4">
              <Text className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setSuccess(false);
                    form.reset();
                  }}
                  className="text-[#B52221] hover:underline"
                >
                  try again
                </button>
              </Text>

              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </section>
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
            Reset Your Password
          </Text>

          <Text className="text-center">
            Enter your email address and we'll send you a link to reset your
            password
          </Text>

          {form.formState.errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <Text className="text-red-600 text-sm">
                {form.formState.errors.root.message}
              </Text>
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

              <Button
                variant="destructive"
                className="mt-10 py-4 rounded-lg w-full"
                type="submit"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "SEND RESET LINK"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-2">
            <Text className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-[#B52221] hover:underline">
                Sign in
              </Link>
            </Text>
          </div>
        </section>
      </main>
    </div>
  );
}
