import { cn } from '../../utils/cn';

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    pulse = false,
    className = '',
}) {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full';

    const variants = {
        default: 'bg-[var(--color-secondary)] text-white',
        accent: 'bg-[var(--color-accent)] text-[var(--text-on-accent)]',
        success: 'bg-[var(--color-success)] text-white',
        error: 'bg-[var(--color-error)] text-white',
        warning: 'bg-[var(--color-warning)] text-[var(--text-on-accent)]',
        outline: 'border-2 border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
            {dot && (
                <span className={cn('w-2 h-2 rounded-full bg-current', pulse && 'animate-pulse')} />
            )}
            {children}
        </span>
    );
}
