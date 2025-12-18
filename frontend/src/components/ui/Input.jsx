import { useState } from 'react';
import { cn } from '../../utils/cn';
export default function Input({
    label = '',
    error = '',
    type = 'text',
    icon = null,
    suffixIcon = null,
    className = '',
    containerClassName = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={cn('w-full', containerClassName)}>
            {label && (
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        {icon}
                    </div>
                )}

                <input
                    type={inputType}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border-2 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all focus-ring',
                        icon && 'pl-11',
                        (suffixIcon || isPassword) && 'pr-11',
                        error
                            ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
                            : 'border-[var(--border-color)] focus:border-[var(--color-accent)]',
                        className
                    )}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}

                {suffixIcon && !isPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        {suffixIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-[var(--color-error)] flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
