import { cn } from '../../utils/cn';

export default function Card({
    children,
    variant = 'raised',
    className = '',
    header = null,
    footer = null,
    headerClassName = '',
    footerClassName = '',
    onClick = null,
    ...props
}) {
    const baseStyles = 'rounded-xl overflow-hidden transition-smooth';

    const variants = {
        flat: 'bg-[var(--surface-primary)]',
        raised: 'bg-[var(--surface-primary)] shadow-lg hover-lift',
        outlined: 'bg-[var(--surface-primary)] border-2 border-[var(--border-color)]',
        glass: 'glass',
    };

    const isClickable = typeof onClick === 'function';

    return (
        <div
            className={cn(
                baseStyles,
                variants[variant],
                isClickable && 'cursor-pointer',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {header && (
                <div className={cn('px-6 py-4 border-b border-[var(--border-color)]', headerClassName)}>
                    {header}
                </div>
            )}

            <div className="px-6 py-4">
                {children}
            </div>

            {footer && (
                <div className={cn('px-6 py-4 border-t border-[var(--border-color)] bg-[var(--surface-secondary)]', footerClassName)}>
                    {footer}
                </div>
            )}
        </div>
    );
}
