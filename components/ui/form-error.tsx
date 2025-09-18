import { AlertCircle } from "lucide-react";
import { Text } from "./text";

interface FormErrorProps {
  id?: string;
  message: string;
  className?: string;
}

export function FormError({ id, message, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className={`flex items-center space-x-2 text-red-600 text-sm ${className}`}
    >
      <AlertCircle size={16} className="flex-shrink-0" />
      <Text className="text-red-600 text-sm">{message}</Text>
    </div>
  );
}

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export function FormField({ children, error, className = "" }: FormFieldProps) {
  return (
    <div className={`grid gap-2 ${className}`}>
      {children}
      {error && <FormError message={error} />}
    </div>
  );
}

interface FormSectionProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export function FormSection({ children, error, className = "" }: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <FormError message={error} />
        </div>
      )}
      {children}
    </div>
  );
}
