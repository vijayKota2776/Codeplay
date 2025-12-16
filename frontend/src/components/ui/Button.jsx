import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon = null,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-250 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[var(--color-accent)] text-[var(--text-on-accent)] hover:bg-[var(--color-accent-light)] active:scale-95 shadow-md hover:shadow-lg glow',
        secondary: 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-light)] active:scale-95 shadow-md hover:shadow-lg',
        outline: 'border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--text-on-accent)] active:scale-95',
        ghost: 'text-[var(--color-accent)] hover:bg-[var(--surface-primary)] active:scale-95',
        danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-light)] active:scale-95 shadow-md hover:shadow-lg',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="flex items-center">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}
