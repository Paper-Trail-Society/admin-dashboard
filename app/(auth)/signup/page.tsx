"use client";

import { Button } from "@/components/ui/button";
import {
  MultiSelect,
  SelectValueBase,
} from "@/components/ui/createable-select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import TextField from "@/components/ui/text-field";
import { useSignUp } from "@/domains/auth/hooks";
import { SignupFormData, signupSchema } from "@/domains/auth/schemas";
import useGetInstitutions from "@/domains/institutions/hooks/use-get-institutions";
import { Keyword } from "@/domains/paper/types";
import { useRedirectIfAuthenticated } from "@/lib/hooks/use-auth-guard";
import { $http } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

function SignupContent() {
  const [success, setSuccess] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<SelectValueBase[]>(
    []
  );
  const [keywordOptions, setKeywordOptions] = useState<SelectValueBase[]>([]);
  const { shouldRedirect, isLoading: authLoading } =
    useRedirectIfAuthenticated();
  const {
    data: institutions,
    isLoading: institutionsLoading,
    error: institutionsError,
  } = useGetInstitutions();

  // Debounced keyword search
  const debouncedKeywordSearch = useDebouncedCallback(async (query: string) => {
    if (query.length < 2) {
      setKeywordOptions([]);
      return;
    }

    try {
      const response = await $http.get<{ keywords: Keyword[] }>(
        `/keywords/search?q=${encodeURIComponent(query)}`
      );
      const options = response.data.keywords.map((keyword) => ({
        value: keyword.name,
        label: keyword.name,
      }));
      setKeywordOptions(options);
    } catch (error) {
      console.error("Error searching keywords:", error);
      setKeywordOptions([]);
    }
  }, 300);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      institutionId: undefined,
      areasOfInterest: [],
    },
    mode: "onChange",
  });

  const signUpMutation = useSignUp({
    onSuccess: () => {
      setSignupEmail(form.getValues("email"));
      setSuccess(true);
    },
    onError: (error) => {
      console.error("Sign up error:", error);
      form.setError("root", {
        message: error.message || "An error occurred during signup",
      });
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signUpMutation.mutate(data);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="items-center justify-items-center min-h-screen">
        <main className="flex flex-col items-center justify-center py-20 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </main>
      </div>
    );
  }

  // Only redirect if authenticated AND not showing success message
  if (shouldRedirect && !success) {
    return (
      <div className="items-center justify-items-center">
        <main className="flex flex-col items-center justify-center py-20 w-full">
          <div className="text-center">
            <p>Redirecting...</p>
          </div>
        </main>
      </div>
    );
  }

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

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-md">
              <Text className="text-blue-800">
                We've sent a verification link to <strong>{signupEmail}</strong>
              </Text>
              <Text className="text-blue-700 text-sm mt-2">
                Please check your email and click the verification link to
                activate your account.
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
          <Text className="text-center leading-6 text-3xl">Join Desci NG</Text>

          <Text className="text-center leading-2">
            Create your account to get started
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
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
                className="p-6 ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50"
                required
              />

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
                placeholder="Create a password"
                type="password"
                autoComplete="new-password"
                className="p-6 ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50"
                required
              />

              <TextField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
                autoComplete="new-password"
                className="p-6 ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50"
                required
              />

              {/* Institution Selection */}
              <FormField
                control={form.control}
                name="institutionId"
                render={({ field }) => (
                  <FormItem>
                    <Label className="md:text-lg text-sm text-text font-bold">
                      Affiliated Institution
                    </Label>
                    <FormControl>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          const numValue = value ? parseInt(value) : undefined;
                          field.onChange(numValue);
                        }}
                      >
                        <SelectTrigger className="h-14 px-6 py-4 text-left bg-white ring-1 ring-neutral-400 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50 focus:ring-2 focus:ring-[#B52221]/20 rounded-md">
                          <SelectValue
                            placeholder={
                              institutionsLoading
                                ? "Loading institutions..."
                                : institutionsError
                                ? "Error loading institutions"
                                : !institutions || institutions.length === 0
                                ? "No institutions available"
                                : "Select your institution (optional)"
                            }
                            className="text-gray-900 placeholder:text-gray-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
                          {institutionsLoading ? (
                            <SelectItem
                              value="loading"
                              disabled
                              className="text-gray-500 cursor-not-allowed"
                            >
                              Loading institutions...
                            </SelectItem>
                          ) : institutionsError ? (
                            <SelectItem
                              value="error"
                              disabled
                              className="text-red-500 cursor-not-allowed"
                            >
                              Error loading institutions
                            </SelectItem>
                          ) : institutions && institutions.length > 0 ? (
                            institutions.map((institution) => (
                              <SelectItem
                                key={institution.id}
                                value={institution.id.toString()}
                                className="px-4 py-3 text-gray-900 hover:bg-gray-50 focus:bg-[#B52221]/10 cursor-pointer"
                              >
                                {institution.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem
                              value="no-institutions"
                              disabled
                              className="text-gray-500 cursor-not-allowed"
                            >
                              No institutions available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Areas of Interest */}
              <FormField
                control={form.control}
                name="areasOfInterest"
                render={({ field }) => (
                  <FormItem className="pb-2">
                    <Label className="md:text-lg text-sm text-text font-bold">
                      Areas of Interest
                    </Label>
                    <FormControl>
                      <MultiSelect
                        name="areasOfInterest"
                        value={selectedKeywords}
                        handleChange={(
                          newKeywords: readonly SelectValueBase[]
                        ) => {
                          const keywordArray = Array.from(newKeywords);
                          setSelectedKeywords(keywordArray);
                          const values = keywordArray.map((k) => k.value);
                          field.onChange(values);
                        }}
                        options={keywordOptions}
                        loadOptions={(searchVal, setOptions) => {
                          debouncedKeywordSearch(searchVal);
                          setOptions(keywordOptions);
                        }}
                        placeholder="Search and select your areas of interest..."
                        className="min-h-14"
                        controlStyles={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          minHeight: "56px",
                          boxShadow: "0 0 0 1px rgb(163 163 163)",
                          "&:hover": {
                            boxShadow: "0 0 0 1px rgb(163 163 163)",
                          },
                          "&:focus-within": {
                            boxShadow:
                              "0 0 0 1px #B52221, 0 0 0 3px rgba(181, 34, 33, 0.2)",
                          },
                        }}
                        menuStyles={{
                          backgroundColor: "white",
                          border: "1px solid rgb(229 231 235)",
                          borderRadius: "6px",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          zIndex: 50,
                        }}
                        optionStyles={{
                          padding: "12px 16px",
                          "&:hover": {
                            backgroundColor: "rgb(249 250 251)",
                          },
                          "&:focus": {
                            backgroundColor: "rgba(181, 34, 33, 0.1)",
                          },
                        }}
                        isCreatable={true}
                        isAsync={true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                variant="destructive"
                className="mt-10 py-4 rounded-lg w-full"
                type="submit"
                disabled={signUpMutation.isPending}
              >
                {signUpMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "CREATE ACCOUNT"
                )}
              </Button>
            </form>
          </Form>

          {/* <SocialAuth mode="signup" /> */}

          <div className="text-center space-y-2">
            <Text className="text-sm text-gray-600">
              Already have an account?{" "}
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

export default function Signup() {
  return <SignupContent />;
}
