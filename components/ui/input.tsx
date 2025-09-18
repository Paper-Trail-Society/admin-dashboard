import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils/css';

const inputVariants = cva(
  'flex w-full text-text rounded-sm shadow-sm ring-1 ring-neutral-300 border-[#F3E7E780]/50 focus:border-[#F3E7E780]/50 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ',
  {
    variants: {
      variant: {
        default: 'border-input border-border-1 placeholder:text-text-dim',
        filled: 'bg-inputFill border-border-1 placeholder:text-text-dim',
        unstyled:
          'border-0 bg-transparent placeholder:text-text-dim focus-visible:ring-transparent focus-visible:outline-none',
      },
      customSize: {
        default: 'px-[13px] text-[calc(13_/_16_*_1rem)] h-[34px] text-xs',
        sm: 'h-[30px] px-[13px] text-xs',
        lg: 'h-10 px-[17px] rounded-md text-[calc(13_/_16_*_1rem)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      customSize: 'default',
    },
  },
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, customSize, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(className, inputVariants({ variant, customSize, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input, inputVariants };
