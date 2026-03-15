import React, { forwardRef, InputHTMLAttributes } from 'react';
import { classNames } from '../../utils/helpers';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);
    return (
      <div className="w-full font-genos">
        {label &&
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-1">
          
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        }
        <div className="relative">
          {icon &&
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          }
          <input
            ref={ref}
            id={inputId}
            className={classNames(
              'block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base transition-colors bg-[#1A1A24]/80 text-white placeholder-gray-500',
              icon ? 'pl-10' : 'pl-3',
              error ?
              'border-red-500/50 text-red-400 placeholder-red-500/50 focus:ring-red-500 focus:border-red-500' :
              'border-[#2A2A34]',
              props.disabled ?
              'bg-[#111118] text-gray-600 cursor-not-allowed' :
              '',
              className
            )}
            {...props} />
          
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        {helperText && !error &&
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        }
      </div>);

  }
);
Input.displayName = 'Input';