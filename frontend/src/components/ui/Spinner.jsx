import { cn } from '../../utils/cn';

/**
 * Loading Spinner Component
 */
export default function Spinner({
    size = 'md',
    color = 'accent',
    className = '',
}) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const colors = {
        accent: 'text-[var(--color-accent)]',
        secondary: 'text-[var(--color-secondary)]',
        white: 'text-white',
    };

    return (
        <svg
            className={cn('animate-spin', sizes[size], colors[color], className)}
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

/**
 * Full Page Loading Component
 */
export function PageSpinner({ message = 'Loading...' }) {
    return (
        <div className="fixed inset-0 bg-[var(--color-dominant)] flex flex-col items-center justify-center z-50">
            <Spinner size="xl" />
            {message && (
                <p className="mt-4 text-[var(--text-secondary)] text-lg">{message}</p>
            )}
        </div>
    );
}
