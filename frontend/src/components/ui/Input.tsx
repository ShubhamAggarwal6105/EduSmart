import React from 'react';
import { cn } from '../../utils/tailwind';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  as?: 'input' | 'textarea';
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, type, error, label, icon, fullWidth = false, as = 'input', ...props }, ref) => {
    const Component = as;
    
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <Component
            type={type}
            className={cn(
              'block rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              fullWidth && 'w-full',
              as === 'textarea' && 'resize-none',
              className
            )}
            ref={ref as any}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };