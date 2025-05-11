import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, leftIcon, rightIcon, className, ...props }, ref) => {
    const inputClasses = twMerge(
      clsx(
        'block rounded-md border-gray-300 shadow-sm',
        'focus:border-blue-500 focus:ring-blue-500',
        {
          'w-full': fullWidth,
          'border-red-500 focus:border-red-500 focus:ring-red-500': error,
          'pl-10': leftIcon,
          'pr-10': rightIcon,
        },
        className
      )
    );

    return (
      <div className={clsx('flex flex-col', { 'w-full': fullWidth })}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';