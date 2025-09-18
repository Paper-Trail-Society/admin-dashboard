"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import TextField from "@/components/ui/text-field";
import { useNewPassword } from "@/domains/auth/hooks";
import { NewPasswordFormData, newPasswordSchema } from "@/domains/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function ResetPasswordContent() {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const newPasswordMutation = useNewPassword({
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error) => {
      form.setError("root", {
        message: error.message || "An error occurred while resetting password",
      });
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/forgot-password");
    }
  }, [token, router]);

  const onSubmit = (data: NewPasswordFormData) => {
    if (!token) {
      form.setError("root", { message: "Invalid reset token" });
      return;
    }

    newPasswordMutation.mutate({ data, token });
  };

  if (success) {
    return (
      <div className="items-center justify-items-center ">
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
              Password Reset Successful
            </Text>

            <div className="p-6 bg-green-50 border border-green-200 rounded-md">
              <Text className="text-green-800">
                Your password has been successfully reset!
              </Text>
              <Text className="text-green-700 text-sm mt-2">
                You can now sign in with your new password.
              </Text>
            </div>

            <Link href="/login">
              <Button variant="destructive" className="w-full py-4">
                SIGN IN
              </Button>
            </Link>
          </section>
        </main>
      </div>
    );
  }

  if (!token) {
    return null; // Will redirect to forgot-password
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
            Set New Password
          </Text>

          <Text className="text-center leading-2">
            Enter your new password below
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
                name="password"
                label="New Password"
                placeholder="Enter your new password"
                type="password"
                autoComplete="new-password"
                className="p-6 ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50"
                required
              />

              <TextField
                control={form.control}
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                type="password"
                autoComplete="new-password"
                className="p-6 ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50"
                required
              />

              <Button
                variant="destructive"
                className="mt-10 py-4 rounded-lg w-full"
                type="submit"
                disabled={newPasswordMutation.isPending}
              >
                {newPasswordMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "RESET PASSWORD"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
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

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
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
            <section className="md:w-1/3 w-full mx-auto my-10 space-y-6 px-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 size={32} className="animate-spin" />
                <Text className="text-gray-600">Loading...</Text>
              </div>
            </section>
          </main>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
