import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">{label}</label>
        )}
        <input
          ref={ref}
          suppressHydrationWarning
          className={`w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] transition-all text-xs shadow-xs
            ${error ? 'border-red-500 focus:ring-red-500/30' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
