"use client";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useVerifyEmail } from "@/domains/auth/hooks";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmailMutation = useVerifyEmail({
    onSuccess: () => {
      setStatus("success");
    },
    onError: (error) => {
      if (error.message?.includes("expired")) {
        setStatus("expired");
      } else {
        setStatus("error");
        setError(error.message || "Email verification failed");
      }
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid verification link");
      return;
    }

    // Verify email with token
    verifyEmailMutation.mutate(token);
  }, [token, verifyEmailMutation]);

  const handleResendVerification = () => {
    // We need the email to resend verification
    // For now, redirect to signup to resend
    router.push("/signup");
  };

  if (status === "loading") {
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

          <section className="md:w-1/3 w-full mx-auto my-10 space-y-6 px-8 text-center">
            <Text className="text-center leading-6 text-3xl">
              Verifying Your Email
            </Text>

            <div className="flex flex-col items-center space-y-4">
              <Loader2 size={32} className="animate-spin" />
              <Text className="text-gray-600">
                Please wait while we verify your email address...
              </Text>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (status === "success") {
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

          <section className="md:w-1/3 w-full mx-auto my-10 space-y-6 px-8 text-center">
            <Text className="text-center leading-6 text-3xl">
              Email Verified Successfully!
            </Text>

            <div className="p-6 bg-green-50 border border-green-200 rounded-md">
              <Text className="text-green-800">
                Your email has been successfully verified!
              </Text>
              <Text className="text-green-700 text-sm mt-2">
                You can now sign in to your account and access all features.
              </Text>
            </div>

            <Link href="/login">
              <Button variant="destructive" className="w-full py-4">
                SIGN IN TO YOUR ACCOUNT
              </Button>
            </Link>
          </section>
        </main>
      </div>
    );
  }

  if (status === "expired") {
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

          <section className="md:w-1/3 w-full mx-auto my-10 space-y-6 px-8 text-center">
            <Text className="text-center leading-6 text-3xl">
              Verification Link Expired
            </Text>

            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md">
              <Text className="text-yellow-800">
                Your verification link has expired.
              </Text>
              <Text className="text-yellow-700 text-sm mt-2">
                Please request a new verification email to complete your account
                setup.
              </Text>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleResendVerification}
                disabled={false}
                variant="destructive"
                className="w-full py-4"
              >
                RESEND VERIFICATION EMAIL
              </Button>

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

  // Error state
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

        <section className="md:w-1/3 w-full mx-auto my-10 space-y-6 px-8 text-center">
          <Text className="text-center leading-6 text-3xl">
            Verification Failed
          </Text>

          <div className="p-6 bg-red-50 border border-red-200 rounded-md">
            <Text className="text-red-800">
              {error || "Email verification failed"}
            </Text>
            <Text className="text-red-700 text-sm mt-2">
              The verification link may be invalid or expired.
            </Text>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleResendVerification}
              disabled={false}
              variant="destructive"
              className="w-full py-4"
            >
              RESEND VERIFICATION EMAIL
            </Button>

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

export default function VerifyEmail() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
