"use client";

import React, { useRef, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { FormError } from "./form-error";

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export function AccessibleInput({
  label,
  error,
  helperText,
  required = false,
  autoFocus = false,
  id,
  className = "",
  ...props
}: AccessibleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId} className="font-medium">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </Label>
      
      <Input
        ref={inputRef}
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`${className} ${error ? "border-red-500 focus:border-red-500" : ""}`}
        {...props}
      />
      
      {helperText && (
        <div id={helperId} className="text-sm text-gray-600">
          {helperText}
        </div>
      )}
      
      {error && <FormError id={errorId} message={error} />}
    </div>
  );
}

interface AccessibleFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function AccessibleForm({
  title,
  description,
  children,
  onSubmit,
  ...props
}: AccessibleFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Find first invalid input and focus it
    const firstInvalidInput = formRef.current?.querySelector(
      'input[aria-invalid="true"]'
    ) as HTMLInputElement;
    
    if (firstInvalidInput) {
      firstInvalidInput.focus();
      firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      role="form"
      aria-label={title}
      {...props}
    >
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-center">{title}</h1>
          {description && (
            <p className="text-center text-gray-600 mt-2">{description}</p>
          )}
        </div>
      )}
      
      <div className="space-y-4" role="group">
        {children}
      </div>
    </form>
  );
}

// Skip link component for keyboard navigation
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
    >
      {children}
    </a>
  );
}

// Focus trap for modals/dialogs
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Handle escape key - could close modal, etc.
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscapeKey);
    
    // Focus first element when trap becomes active
    firstElement?.focus();

    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
}
